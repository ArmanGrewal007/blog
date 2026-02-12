import numpy as np
import plotly.graph_objects as go
import plotly.io as pio

pio.renderers.default = "browser"

# ==============================
# INDIAN NUMBER FORMAT FUNCTION
# ==============================

def indian_format(num):
    num = int(round(num))
    s = str(abs(num))

    if len(s) <= 3:
        result = s
    else:
        last3 = s[-3:]
        rest = s[:-3]
        rest = rest[::-1]
        groups = [rest[i:i+2] for i in range(0, len(rest), 2)]
        indian = ",".join(groups)[::-1]
        result = indian + "," + last3

    return ("-" if num < 0 else "") + result


# ==============================
# SETTINGS
# ==============================

MAX_SALARY = 5000000   # 50 Lakhs
STEP = 10000


# ==============================
# TAX ENGINE
# ==============================

def compute_progressive_tax(taxable_income, slabs):
    tax = 0
    remaining_income = taxable_income

    for slab_amount, rate in slabs:
        taxable = min(remaining_income, slab_amount)
        tax += taxable * rate
        remaining_income -= taxable

        if remaining_income <= 0:
            break

    return tax


def apply_rebate(tax, taxable_income, rebate_limit):
    if taxable_income <= rebate_limit:
        return 0
    return tax


def apply_surcharge(tax, taxable_income, surcharge_slabs):
    surcharge_rate = 0
    for limit, rate in surcharge_slabs:
        if taxable_income > limit:
            surcharge_rate = rate
        else:
            break
    return tax * (1 + surcharge_rate)


def calculate_tax(income, standard_deduction, slabs, rebate_limit, surcharge_slabs):
    taxable_income = max(0, income - standard_deduction)

    base_tax = compute_progressive_tax(taxable_income, slabs)

    tax_after_rebate = apply_rebate(base_tax, taxable_income, rebate_limit)

    tax_after_surcharge = apply_surcharge(
        tax_after_rebate,
        taxable_income,
        surcharge_slabs
    )

    final_tax = tax_after_surcharge * 1.04  # 4% cess

    return final_tax


# ==============================
# OLD REGIME
# ==============================

old_slabs = [
    (250000, 0.00),
    (250000, 0.05),
    (500000, 0.20),
    (float("inf"), 0.30)
]

old_surcharge_slabs = [
    (50_00_000, 0.10),
    (1_00_00_000, 0.15),
    (2_00_00_000, 0.25),
    (5_00_00_000, 0.37)
]

def old_regime_tax(income):
    return calculate_tax(
        income,
        50000,
        old_slabs,
        500000,
        old_surcharge_slabs
    )


# ==============================
# NEW REGIME
# ==============================

new_slabs = [
    (400000, 0.00),
    (400000, 0.05),
    (400000, 0.10),
    (400000, 0.15),
    (400000, 0.20),
    (400000, 0.25),
    (float("inf"), 0.30)
]

new_surcharge_slabs = [
    (50_00_000, 0.10),
    (1_00_00_000, 0.15),
    (2_00_00_000, 0.25)
]

def new_regime_tax(income):
    return calculate_tax(
        income,
        75000,
        new_slabs,
        1200000,
        new_surcharge_slabs
    )


# ==============================
# GENERATE DATA
# ==============================

salaries = np.arange(0, MAX_SALARY + STEP, STEP)

old_taxes = [old_regime_tax(s) for s in salaries]
new_taxes = [new_regime_tax(s) for s in salaries]


# ==============================
# CREATE PLOT
# ==============================

fig = go.Figure()

fig.add_trace(go.Scatter(
    x=salaries,
    y=old_taxes,
    mode='lines',
    name='Old Regime',
    hovertemplate=
        "Salary: ₹%{customdata[0]}<br>" +
        "Tax: ₹%{customdata[1]}<extra></extra>",
    customdata=[
        (indian_format(s), indian_format(t))
        for s, t in zip(salaries, old_taxes)
    ]
))

fig.add_trace(go.Scatter(
    x=salaries,
    y=new_taxes,
    mode='lines',
    name='New Regime',
    hovertemplate=
        "Salary: ₹%{customdata[0]}<br>" +
        "Tax: ₹%{customdata[1]}<extra></extra>",
    customdata=[
        (indian_format(s), indian_format(t))
        for s, t in zip(salaries, new_taxes)
    ]
))

# Axis formatting with Indian style
tick_positions = salaries[::50]

fig.update_xaxes(
    tickvals=tick_positions,
    ticktext=[indian_format(x) for x in tick_positions],
    title="Annual Salary (₹)"
)

fig.update_yaxes(
    tickvals=[min(old_taxes)] + old_taxes[::50],
    ticktext=[indian_format(y) for y in ([min(old_taxes)] + old_taxes[::50])],
    title="Tax Payable (₹)"
)
# fig.update_xaxes(showspikes=True)


fig.update_layout(
    # title="Old vs New Tax Regime Comparison",
    template="plotly_white",
    hovermode="x unified",
    hoverlabel=dict(namelength=-1),
    margin=dict(t=20)
)

fig.show()

fig.write_html("chart.html", include_plotlyjs="cdn")
