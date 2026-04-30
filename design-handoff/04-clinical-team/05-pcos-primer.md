# PCOS — Everything You Need to Know
**HormonaIQ Internal Education Document**
*Written for: founders, engineers, investors, advisors — anyone who needs to understand the problem before understanding the product*
*Date: April 2026 | Version: 1.0*

---

## The One-Paragraph Version

PCOS (Polycystic Ovary Syndrome) is the most common hormonal condition in women of reproductive age, affecting 1 in 10 women — roughly 200 million people globally. Despite its name, PCOS is not primarily a disease of the ovaries. It is a complex metabolic and hormonal condition whose core mechanism is insulin resistance driving androgen (male hormone) excess, which then disrupts the ovarian cycle. The result is a spectrum of symptoms that can include irregular or absent periods, acne, excess facial and body hair, hair thinning on the scalp, difficulty getting pregnant, weight gain, depression, anxiety, and brain fog. Long-term, unmanaged PCOS doubles the risk of Type 2 diabetes, triples the risk of endometrial cancer, and significantly elevates cardiovascular risk. Despite affecting 200 million women, the average diagnosis takes 2–4 years and involves seeing 3 or more healthcare providers. There is no cure, but the condition is highly manageable — and management requires understanding your own body at a level of detail that no existing app currently provides.

---

## Part 1: What Is PCOS?

PCOS stands for Polycystic Ovary Syndrome. The name is somewhat misleading on two counts:

1. **"Polycystic" ovaries are not cysts.** They are multiple small, immature follicles — eggs that started to develop but did not complete ovulation. On an ultrasound, a polycystic ovary looks like it is studded with small circles. These follicles are not painful, not dangerous in themselves, and not what causes most PCOS symptoms.

2. **Not everyone with PCOS has polycystic ovaries.** You can have PCOS with completely normal-looking ovaries on ultrasound. The diagnosis does not require ovarian cysts at all.

PCOS is better understood as a **metabolic-hormonal disorder** whose central mechanism is:

> **Insulin resistance → excess insulin → excess androgen production → disrupted ovulation → the full symptom spectrum**

This chain of events explains why PCOS affects so many different systems — skin, hair, menstrual cycle, fertility, weight, mood, metabolism — and why managing one piece of it (just the period, or just the acne) while ignoring the metabolic root is rarely effective.

### Officially, PCOS Is Diagnosed by the Rotterdam Criteria

In 2003, an international panel of reproductive endocrinologists and fertility specialists established the Rotterdam Criteria — the diagnostic standard still used today. A person has PCOS if they have **at least 2 of these 3 characteristics**, after excluding other causes:

1. **Irregular or absent ovulation** — cycles longer than 35 days, fewer than 8 periods per year, or confirmed anovulation (egg never released)
2. **Hyperandrogenism** — elevated male hormones, shown either in bloodwork (elevated testosterone, DHEA-S) or clinical signs (hirsutism, acne, male-pattern hair thinning)
3. **Polycystic ovarian morphology** — 20 or more small follicles per ovary, or ovarian volume >10 mL on ultrasound

This 2-of-3 rule creates **four distinct PCOS phenotypes** with meaningfully different clinical profiles:

| Phenotype | Features | Risk Profile |
|-----------|----------|-------------|
| A (Classic Full) | All 3: irregular cycles + high androgens + polycystic ovaries | Highest metabolic risk; most common; highest insulin resistance prevalence |
| B (Classic, no ultrasound) | Irregular cycles + high androgens (no ultrasound needed) | Near-equivalent to Phenotype A; metabolic risk almost identical |
| C (Ovulatory PCOS) | Regular cycles + high androgens + polycystic ovaries | Androgenic symptoms without cycle irregularity; often missed or dismissed |
| D (Non-androgenic) | Irregular cycles + polycystic ovaries (no androgen symptoms) | Milder metabolic profile; no skin/hair symptoms; may not recognize self as "PCOS" |

Why does phenotype matter? Because a Phenotype A woman needs aggressive insulin resistance monitoring and management. A Phenotype C woman has regular cycles but still struggles with acne and hair growth — she may be told "you can't have PCOS, your periods are regular." A Phenotype D woman has no androgen symptoms at all and often has the mildest metabolic picture. An app that treats all PCOS users identically is delivering the wrong content to 3 out of 4 users.

---

## Part 2: Why Does PCOS Happen? (The Biology)

### The Insulin Resistance Story

In most women with PCOS, the chain begins with **insulin resistance** — the body's cells do not respond normally to insulin, so the pancreas produces more insulin to compensate. This excess insulin has two effects that drive PCOS:

**Effect 1: Excess insulin tells the ovaries to produce more testosterone.** The ovarian theca cells have insulin receptors. When they are flooded with insulin, they produce androgens (testosterone, DHEA) at elevated rates. This is the mechanism linking metabolic health to every androgenic PCOS symptom — acne, hirsutism, alopecia.

**Effect 2: Excess insulin suppresses SHBG (Sex Hormone-Binding Globulin).** SHBG is a protein that binds testosterone in the blood, keeping it biologically inactive. When SHBG drops (which it does in insulin resistance), more testosterone becomes free and active — amplifying every androgenic effect.

**Effect 3: Excess insulin and androgens disrupt the LH/FSH signaling** that drives normal ovarian follicle development. Instead of one dominant follicle maturing and ovulating each cycle, multiple follicles start developing and then stall. The ovaries become studded with these immature follicles — the "polycystic" appearance on ultrasound.

### Where Does the Insulin Resistance Come From?

PCOS is **polygenic** (multiple genes involved) and **multifactorial** (genes + environment). Risk factors include:
- Family history of PCOS, Type 2 diabetes, or early cardiovascular disease
- Intrauterine androgenic environment (daughters of women with PCOS are at higher risk)
- Obesity — though critically, **lean women also get PCOS** (20–30% of PCOS patients are lean), and the insulin resistance in lean PCOS is often more subtle and harder to detect with standard tests
- Chronic inflammation — inflammatory cytokines worsen insulin resistance
- Poor sleep / sleep apnea — sleep deprivation acutely worsens insulin sensitivity; up to 30% of PCOS patients have sleep apnea

This is important for the product: **weight is not the cause of PCOS**. Weight can amplify insulin resistance, but thin women get PCOS too, and overweight women with PCOS are not overweight because of poor lifestyle choices — they are often overweight because hyperinsulinemia drives fat storage, makes calorie restriction ineffective, and causes relentless hunger. Treating PCOS users as if their weight is their fault is both clinically wrong and deeply harmful.

---

## Part 3: Who Gets PCOS?

- **Prevalence:** 1 in 10 women of reproductive age — approximately 200 million people globally. 5–6 million in the United States. 10% of the Australian female population.
- **Age of onset:** Symptoms often appear at or around puberty (the first period), but diagnosis typically comes years or decades later. PCOS does not go away after menopause — metabolic risk continues and management is lifelong.
- **Ethnic variation:** PCOS occurs in all ethnic groups; some studies suggest higher prevalence in South Asian and Middle Eastern women (relevant for a global product — the Australian market includes significant South Asian diaspora populations).
- **Lean vs. overweight:** 20–30% of PCOS patients are lean (BMI <25). Lean PCOS is frequently missed because doctors assume PCOS only presents in overweight patients.

---

## Part 4: What Are the Symptoms? (The Full Spectrum)

PCOS presents differently in different people. This is one reason it is under-diagnosed — there is no single universal presentation.

### Androgenic Symptoms (Caused by Excess Male Hormones)

| Symptom | What It Looks Like | How Common |
|---------|-------------------|-----------|
| Hirsutism | Excess hair growth on face (chin, upper lip, sideburns), chest, abdomen, upper thighs | 60–70% of PCOS patients |
| Acne | Especially on jawline, chin, and cheeks — "hormonal acne" pattern; also chest/back acne | ~60% |
| Androgenic alopecia | Thinning hair at the top and front of the scalp; diffuse thinning rather than bald patches | ~48% |
| Oily skin / seborrhoea | Excess sebum production driven by androgens | Common |
| Acanthosis nigricans | Dark, velvety skin at the neck, armpits, or groin — a sign of insulin resistance, not cleanliness | 40–80% with insulin resistance |
| Skin tags | Soft, small skin growths in skin fold areas — an underrecognized insulin resistance marker | Common with IR |

### Metabolic Symptoms (Caused by Insulin Resistance)

| Symptom | What It Looks Like | Clinical Significance |
|---------|-------------------|--------------------|
| Insulin resistance | Body struggles to process carbohydrates normally; may not show on standard fasting glucose test | Present in ~70% of PCOS patients |
| Post-meal energy crash | Fatigue and brain fog 1–2 hours after eating, especially after high-carbohydrate meals | Direct marker of insulin cycling |
| Sugar and carbohydrate cravings | Intense, compulsive — driven by glucose dysregulation, not willpower failure | Insulin-driven hunger mechanism |
| Brain fog | Difficulty concentrating, slow processing; correlates with insulin resistance severity | Well-documented |
| Fatigue | Chronic exhaustion not relieved by sleep; linked to IR, sleep apnea, inflammation | Very common; often dismissed |
| Dyslipidemia | High triglycerides, low HDL cholesterol — standard lipid panel will show this | Cardiovascular risk component |
| Elevated blood pressure | Developing earlier than general population average | Cardiovascular risk |

### Reproductive Symptoms

| Symptom | What It Looks Like | Clinical Significance |
|---------|-------------------|--------------------|
| Irregular or absent periods | Cycles >35 days, fewer than 8 periods per year, or no periods at all | Anovulatory cycling; endometrial hyperplasia risk if prolonged |
| Anovulation (no egg release) | Cycle appears to happen but no ovulation occurred | Primary fertility challenge in PCOS |
| Pelvic pain or pressure | Enlarged ovaries from multiple follicles; can cause dull chronic pressure | Structural |
| Fertility difficulty | 70–80% of ovulatory infertility cases are PCOS-related | Most common ovulatory cause of female infertility |

### Psychological Symptoms

| Symptom | Prevalence | Clinical Note |
|---------|-----------|--------------|
| Depression | ~36% (2.79× general population rate) | Both hormonal and psychological drivers |
| Anxiety | ~41% (3–4× general population rate) | Hyperandrogenism and insulin dysregulation both contribute |
| Body image distress | Very high | Driven by hirsutism, acne, weight changes, hair thinning |
| Eating disorders | 4× general population rate | Binge eating disorder most common; calorie restriction triggers restriction-binge cycles |
| PMDD | HR 1.54 (54% more likely than women without PCOS) | Hormonal volatility in PCOS creates PMDD vulnerability |

---

## Part 5: What Are the Long-Term Health Risks?

PCOS is not just a reproductive condition. It is a lifelong metabolic condition with serious long-term consequences if unmanaged.

### Metabolic Risks
- **Type 2 Diabetes:** Women with PCOS are 2–4× more likely to develop T2DM than the general population. Risk increases with age and is present even in lean PCOS.
- **Pre-diabetes / Impaired Glucose Tolerance:** Present in approximately 30% of PCOS patients under 40.
- **Metabolic Syndrome:** A cluster of 5 metabolic risk factors (abdominal obesity, high triglycerides, low HDL, high blood pressure, impaired fasting glucose) that together predict T2DM and cardiovascular disease. Prevalence in PCOS is significantly higher than general population.

### Cardiovascular Risks
- Hypertension risk is elevated and occurs earlier
- Dyslipidemia (high TG, low HDL) is common even in lean PCOS
- Atherosclerosis markers (carotid intima-media thickness) are elevated in PCOS patients in their 30s

### Endometrial Risk
- Anovulatory PCOS means the endometrium (uterine lining) is exposed to estrogen continuously without the monthly progesterone of ovulation. Unopposed estrogen causes progressive endometrial hyperplasia.
- Women with PCOS have **2–3× the endometrial cancer risk** of women without PCOS.
- The protective intervention is simple: a progesterone-induced withdrawal bleed at least every 90 days. But no existing app tracks this or flags the risk.

### Mental Health
- PCOS carries a lifetime burden of depression, anxiety, body image distress, and disordered eating that significantly impairs quality of life beyond the physical symptoms.
- Women who received their diagnosis with poor information (which is most women) spend years believing their symptoms are caused by laziness, poor hygiene, or bad luck.

---

## Part 6: How Is PCOS Treated?

PCOS has no cure. Management is the goal — and effective management significantly reduces long-term risk.

### Lifestyle Intervention (First-Line for Everyone)

All 4 major guideline bodies (Endocrine Society, RCOG, AskPCOS/Monash, 2023 International PCOS Guidelines) agree: lifestyle intervention is first-line treatment for every PCOS patient, regardless of weight.

**Why lifestyle intervention works:** Improving insulin sensitivity is the most upstream intervention in the PCOS pathway. Even modest improvements in insulin sensitivity (achievable through dietary quality, exercise, sleep, stress management) reduce androgen production, can restore ovulation, and reduce every downstream symptom.

**What "lifestyle" means for PCOS (specifically):**
- **Low-glycemic diet** — not low-calorie. Low-GI eating reduces postprandial insulin spikes, which reduces androgen production. This is why "eat low-GI" works for PCOS in ways that pure calorie restriction does not.
- **Anti-inflammatory eating** — Mediterranean-pattern diet: whole grains, legumes, fatty fish, nuts, colorful vegetables. Specific foods named in Johns Hopkins PCOS guidance: reduce refined carbs, sugary drinks, red and processed meats.
- **Aerobic and resistance exercise** — both improve insulin sensitivity through different pathways. Dose-response: even 150 minutes per week of moderate activity is clinically significant.
- **Sleep:** Treating sleep apnea and improving sleep quality have direct measurable effects on insulin sensitivity. Sleep is a metabolic intervention.
- **Stress management:** Cortisol worsens insulin resistance; chronic stress is a PCOS amplifier.

Note: "Lose weight" is not a lifestyle intervention — it is an outcome. The interventions are the things above. Weight loss may follow as a consequence, not as a goal.

### Medications

| Medication | What It Does | Who Uses It |
|-----------|-------------|------------|
| **Metformin** | Insulin sensitizer; reduces hepatic glucose production; first-line for metabolic PCOS | Phenotypes A and B primarily; metabolic-dominant presentation |
| **OCP (Oral Contraceptive Pill)** | Suppresses LH (reducing androgen production); regulates cycle; treats hirsutism and acne | Most presentations; does not treat underlying IR |
| **Spironolactone** | Androgen receptor blocker; reduces hirsutism, acne, alopecia | Androgenic symptoms; requires contraception (teratogenic); tracks BP as side effect |
| **Letrozole** | Ovulation induction; aromatase inhibitor | TTC users; first-line for PCOS ovulation induction (superior to Clomiphene) |
| **Myo-inositol + D-chiro-inositol (40:1)** | Insulin sensitizer; improves ovulation; reduces testosterone | Insulin resistance PCOS; strong RCT evidence; not FDA-approved |
| **NAC (N-acetyl cysteine)** | Antioxidant + insulin sensitizer | Emerging evidence; adjunct supplement |
| **Vitamin D** | Supplementation corrects deficiency (67–85% of PCOS patients are deficient); improves insulin sensitivity | Universal supplementation if deficient |
| **Eflornithine cream (Vaniqa)** | Slows facial hair growth; topical; used with laser hair removal | Hirsutism; androgenic presentation |

### Fertility Treatments
- Letrozole is first-line for ovulation induction in PCOS (superior live birth rate vs. Clomiphene: 27.5% vs 19.1%)
- IUI (intrauterine insemination) for unexplained persistence of anovulation after letrozole
- IVF with modified protocols to reduce OHSS risk (PCOS patients are at higher risk)

---

## Part 7: What Does Living With PCOS Actually Look Like?

Clinical descriptions do not capture the lived experience. Direct quotes from r/PCOS (3.2 million members) and r/PCOSloseit:

> "I was told at 17 that I had PCOS. The doctor said 'you might have trouble getting pregnant, lose some weight.' That was it. No explanation, no next steps, nothing. I was 17."

> "TEST YOUR FASTING INSULIN LEVELS! Your fasting glucose can be 'normal' and you can still have severe insulin resistance. I wasted 6 years trying everything until I found this out."

> "I lost 45 lbs not by counting calories but by obsessing over blood sugar. Once I understood my glucose, everything changed. Why has no doctor ever explained this to me?"

> "I track my blood sugar now with a CGM and I can see exactly which foods spike me. I've learned more from two weeks of that than from 10 years of doctors."

> "My dermatologist treated my acne for 4 years with topical antibiotics without ever testing my hormones. I finally got a testosterone test on my own and it was through the roof."

> "The hardest part of PCOS is not the symptoms — it's being told repeatedly that your symptoms are your fault."

### The Two Most Common Experiences

**Experience 1: The woman who learns about her PCOS from Reddit, not from a doctor.** She presents to her GP with irregular periods and acne. She's told "your blood sugar is normal." She never hears about fasting insulin, HOMA-IR, or the Rotterdam Criteria. She goes to r/PCOS and learns more in one hour than in 3 years of appointments. She figures out her own management plan from community posts. She wishes there were an app that knew what she knows.

**Experience 2: The woman who knows she needs to track but has no tool that fits.** She knows low-GI eating helps. She knows her glucose matters more than her calories. She tried MyFitnessPal and it gave her an eating disorder. She has a spreadsheet somewhere. She logs her testosterone results in her phone's Notes app. She takes 14 supplements with no record of what she took when. She has never had a doctor who looked at her full picture in one place.

---

## Part 8: The Care Gap — Why This Problem Is Unsolved

### Diagnosis Delay

- **United States:** Average 2 years from symptom onset to diagnosis
- **Canada:** Average 4.3 years (BMC Women's Health 2023)
- **Australia:** No dedicated national PCOS guideline from an Australian body — clinicians use international guidelines adapted to local practice
- **47.1% of women saw 3+ healthcare providers** before receiving a PCOS diagnosis
- **Only 15.6% were satisfied** with the information they received after diagnosis

Why the delay?
- Irregular periods in young women are often dismissed as normal
- Acne is treated by dermatologists without hormone testing
- Labs are ordered but not the right ones (fasting glucose without fasting insulin misses IR)
- PCOS phenotypes with regular cycles (Phenotype C) are missed entirely
- Lean women with PCOS are told "you can't have PCOS, you're not overweight"
- No tool exists to help women build the longitudinal data picture that makes diagnosis obvious

### What Exists Today — And What's Missing

| Tool | What It Does | Critical Gaps |
|------|-------------|--------------|
| MyFitnessPal | Calorie and macro tracking | No PCOS context; causes eating disorders in this population |
| Clue / Flo | Cycle tracking | Ovulation prediction algorithm is clinically wrong for PCOS; no metabolic or androgenic tracking |
| Belle Health | Symptom + cycle tracking | No lab vault, no mFG scoring, no medication tracking, no metabolic depth |
| AskPCOS (Monash) | PCOS education app | Education only; no tracking; no insights; no physician report |
| Cronometer | Micronutrient tracking | Calorie-centric; no PCOS context |
| Nothing | — | A PCOS-specific tracker with: lab vault, hirsutism scoring, HOMA-IR calculator, phenotype identification, PCOS medication tracker, glycemic food logging, and a physician-ready report format |

A 2025 JMIR study (MARS scale analysis of all PCOS apps) found that every existing PCOS app scores lowest on the two dimensions that matter most: **engagement** and **evidence-based information quality**. Apps look polished but fail clinically. This is peer-reviewed confirmation of the gap.

---

## Part 9: What HormonaIQ Tracks — And Why Every Field Exists

### Why We Track Every Androgenic Symptom Separately (Acne, Hirsutism, Hair Shedding)

Each androgenic symptom responds differently to different treatments. Acne may improve on a drospirenone OCP but hirsutism may not. Spironolactone may reduce hair shedding but cause breakthrough bleeding. Tracking each symptom separately lets the user (and her doctor) see treatment response at the individual symptom level — not just "my PCOS is better."

The **Ferriman-Gallwey Scale** (mFG) is the validated clinical instrument for hirsutism scoring. It scores 9 body sites 0–4, with ≥8 indicating clinical hirsutism. No consumer app has ever implemented this. We implement it in a simplified but faithful form.

Hair removal interval as a hirsutism proxy is a novel HormonaIQ approach: if a user previously needed threading every 2 weeks and after 6 months of spironolactone needs it every 5 weeks — that is measurable, documentable treatment response that no blood test captures.

### Why We Have a Lab Values Vault

PCOS is managed through labs — testosterone, fasting insulin, HOMA-IR, AMH, LH:FSH ratio, SHBG, Vitamin D, lipid panel. Women with PCOS accumulate years of lab results across multiple providers. No existing consumer tool stores these longitudinally, shows trends, and contextualizes them for the user.

The HOMA-IR calculator (fasting insulin × fasting glucose ÷ 405) is the most clinically valuable number for metabolic PCOS — more useful than fasting glucose alone, more accessible than a full metabolic workup. We calculate it automatically when both inputs are provided.

### Why We Specify 2-Hour OGTT (Not Just Fasting Glucose)

The Endocrine Society PCOS patient guide specifically recommends the 2-hour 75g oral glucose tolerance test over fasting glucose alone for PCOS. Fasting glucose misses a clinically significant proportion of PCOS patients with impaired glucose tolerance — their impairment shows only in the post-load response. A woman who has a "normal" fasting glucose of 95 mg/dL may have a 2-hour post-glucose value of 165 mg/dL (impaired glucose tolerance) that is never measured. We track the right test.

### Why We Never Track Calories

PCOS has 4× the general population rate of eating disorders. Binge eating disorder is the most common. Calorie tracking in a population with elevated eating disorder prevalence and insulin dysregulation (which drives compulsive hunger) is a direct pathway to harm.

The clinical evidence supports tracking **glycemic quality** — not calorie quantity. Low-GI eating improves HOMA-IR, restores ovulation, and reduces testosterone in multiple RCTs. Calorie restriction without GI quality focus does not. We track what the evidence supports: the quality of what you eat relative to insulin impact, never how many units of energy it contains.

### Why We Track the Endometrial Hyperplasia Risk (90-Day Amenorrhea Flag)

Women with PCOS who are anovulatory are exposed to unopposed estrogen — estrogen without the protective progesterone that comes from ovulation. This causes progressive endometrial hyperplasia, which is a pre-cancerous condition. After 90 days without a period, the clinical recommendation is to induce a withdrawal bleed with progesterone. No existing app tracks this. We flag it at day 75 (early warning) and day 90 (definitive prompt to discuss with a doctor). This one feature could prevent endometrial cancers.

### Why We Track Blood Pressure Monthly

Two reasons: (1) Hypertension risk is elevated in PCOS, especially in metabolically affected phenotypes. (2) Spironolactone (a common PCOS medication for hirsutism and acne) lowers blood pressure as a side effect — monitoring BP during spironolactone use is a medication safety requirement. We make it easy.

### Why We Have an Annual Monitoring Protocol

Five major clinical bodies agree on the same set of annual checks for PCOS: blood pressure, fasting glucose (or 2-hour OGTT), HbA1c, lipid panel, vitamin D, thyroid, weight/waist, and mental health screening. Most PCOS patients have never had all of these in a single appointment. We track which annual labs have been entered in the past 12 months and generate a pre-filled "ask your doctor for these tests" checklist — turning the app into an annual health review coordinator.

### Why We Use Phenotype Identification

A Phenotype A user and a Phenotype D user have the same diagnosis code (PCOS) but fundamentally different risk profiles, different symptom burdens, and different monitoring priorities. Showing hirsutism-heavy content to a Phenotype D user (no androgen symptoms) is alienating. Treating a Phenotype A user's metabolic risk as mild is dangerous. Content, tracking priorities, and physician report templates all adapt to phenotype — a feature no existing PCOS app has ever built.

---

## Part 10: What Changes If This Works

If HormonaIQ delivers on its clinical promise:

- A woman with irregular cycles and chin hair who has been to 3 dermatologists and none of them tested her testosterone can open the app, log 3 months of symptoms, and arrive at an endocrinologist appointment with: HOMA-IR calculated, mFG score documented across body sites, testosterone trend over 4 months, cycle length history showing anovulatory pattern. Her diagnosis appointment is no longer a 10-minute information vacuum. It is a 20-minute evidence review.

- A woman who was told "your fasting glucose is normal" can log her fasting insulin (which her doctor never ordered) and see her HOMA-IR is 4.7. She brings this to her next appointment and asks for a 2-hour OGTT. She gets one. Her pre-diabetes is caught before it becomes Type 2 diabetes.

- A woman who has been fighting chin hair with threading every 2 weeks starts spironolactone, logs her threading intervals, and at 6 months shows her gynecologist a chart: threading interval went from 14 days to 35 days. That is proof of treatment response no blood test easily captures.

- A woman whose last period was 110 days ago receives a prompt: "90 days without a period in PCOS can affect your uterine lining. Worth a conversation with your doctor." She sees her GP. Her endometrium is assessed. A potential pre-cancer is caught at the hyperplasia stage, not later.

The 2–4 year diagnosis delay is not inevitable. The 10 years of managing PCOS with a Notes app and Reddit threads is not inevitable. What is needed is a tool that understands PCOS at the clinical depth the condition deserves, and delivers that understanding in the 30 seconds of energy a user has on a hard day.

---

---

## Part 11: Everything We Track — The Complete PCOS Data Dictionary

This is every data field HormonaIQ collects for PCOS users. Every field has a clinical justification. Nothing is collected speculatively.

---

### Module 1: Daily Androgenic / Hormonal Symptoms

| Field | Type | Frequency | Clinical Note |
|-------|------|-----------|--------------|
| Acne — face | Scale 1–5 + new lesion count (optional) | Daily | Jawline/chin acne is distinctly androgenic; maps to Rotterdam Criterion 2 |
| Acne — chest/back | Scale 1–5 | Daily | Truncal acne = higher androgen load; correlates with DHEA-S |
| Hair shedding | Scale 1–5 OR strand count (<10 / 10–25 / 25–50 / 50+) | Daily | Androgenic alopecia in 48% of PCOS; Ludwig classification |
| Hirsutism — new growth noticed | Binary + location (chin / upper lip / sideburns / chest / abdomen) | Daily | Rapid-detection log between quarterly mFG assessments |
| Skin oiliness / seborrhoea | Scale 1–5 | Daily | Androgen-driven; tracks response to spironolactone/OCP |
| Scalp health / dandruff | Scale 1–5 | Daily | Scalp seborrhoea co-occurs with androgenic alopecia |
| Acanthosis nigricans | Binary + location (neck / axilla / groin) | Monthly | Dark velvety skin folds = insulin resistance marker; 40–80% PCOS with IR |
| Skin tags | Binary + approximate count | Monthly | Acrochordons in skin folds = underrecognized IR marker; named in Endocrine Society + RCOG guides |

---

### Module 2: Daily Metabolic Symptoms

| Field | Type | Clinical Note |
|-------|------|--------------|
| Energy level | Scale 1–5 | Fatigue is among most common PCOS symptoms; correlates with IR severity |
| Hunger / appetite | Scale 1–5 | Hyperinsulinemia drives dysregulated appetite |
| Sugar / carbohydrate cravings | None / mild / strong | Glucose dysregulation proxy; post-meal insulin cycling |
| Post-meal energy crash | Binary + timing (30min / 1hr / 2hr) | Direct IR symptom — reactive hypoglycemia after high-GI meals |
| Brain fog | Scale 1–5 | Correlates with IR and inflammatory cytokines |
| Fatigue — general | Scale 1–5 | Distinct from post-meal crash; linked to sleep apnea, inflammation |
| Bloating | Scale 1–5 | Worsens in anovulatory cycles; amplified by metformin |

---

### Module 3: Daily Reproductive and Pelvic Symptoms

| Field | Type | Clinical Note |
|-------|------|--------------|
| Pelvic pain | Scale 1–5 + cycle day | Enlarged follicles, ovarian torsion risk, endometriosis comorbidity |
| Ovulation pain (mittelschmerz) | Binary | Indicates follicle rupture — positive ovulation signal; false mittelschmerz also occurs in PCOS |
| Breast tenderness | Scale 1–5 | Indicates progesterone activity; absent in expected luteal = anovulation signal |
| Pelvic heaviness / pressure | Scale 1–5 | Enlarged polycystic ovaries cause chronic pressure |

---

### Module 4: Daily Mood and Mental Health

| Field | Type | Clinical Note |
|-------|------|--------------|
| Anxiety | Scale 1–5 | ~41% prevalence in PCOS (3–4× general population); metabolic and hormonal drivers |
| Low mood / depression | Scale 1–5 | ~36.6% prevalence; 2.79× higher odds of clinical depression |
| Irritability | Scale 1–5 | Tracked against cycle phase to differentiate PCOS vs. PMDD-related |
| Body image / self-image | Scale 1–5 | **Weekly only** — NOT daily; daily prompting is harmful for this population |
| Sleep quality + hours slept | Scale 1–5 + hours | Sleep apnea risk up to 30%; poor sleep worsens IR |

---

### Module 5: Weekly and Periodic Tracking

| Field | Type | Frequency | Clinical Note |
|-------|------|-----------|--------------|
| Weight | Number (kg or lbs) — **user-initiated, hidden by default** | Weekly (optional) | 5–10% reduction improves IR, restores ovulation; framed as metabolic signal, never aesthetic |
| Waist circumference | cm or inches | Monthly | >88cm = metabolic syndrome criterion; more clinically meaningful than BMI |
| Blood pressure | Systolic/Diastolic mmHg | Monthly | Annual monitoring standard (Endocrine Society, RCOG); spironolactone safety check |
| Sleep apnea screening | Diagnosed / suspected / no / unsure + daytime sleepiness 1–5 | Monthly | Up to 30% PCOS prevalence; worsens IR; Endocrine Society-named health risk |
| Exercise type | None / walking / cardio / strength / yoga / other | Daily or weekly | First-line lifestyle intervention; aerobic + resistance both improve IR |
| Exercise duration | Minutes | Daily or weekly | Dose-response evidence for IR improvement |
| Steps (wearable sync) | Number | Daily auto-sync | NEAT (non-exercise activity) is a meaningful metabolic intervention |

---

### Module 6: Cycle Tracking

| Field | Type | Clinical Note |
|-------|------|--------------|
| Period start date | Date | Primary anchor for all cycle calculations |
| Period end date | Date | Bleed duration tracking |
| Bleed intensity | 1–5 | Heavy bleeding is a comorbidity flag |
| Spotting | Binary + cycle day | Irregular spotting in PCOS is common |
| Anovulatory cycle flag | User-confirmed | Explicitly marks cycles where no ovulation occurred |
| Cycle length | Auto-calculated | Rotterdam Criterion 1: >35 days or <8 cycles/year |
| Amenorrhea duration | Auto-calculated from last logged period | Triggers endometrial hyperplasia risk flag at 90 days |

---

### Module 7: Food and Lifestyle Log

| Field | Type | Frequency | Clinical Note |
|-------|------|-----------|--------------|
| Meal quality overall | Scale 1–5 | Daily (day end) | Low-burden proxy for dietary adherence |
| Low-GI eating today | Yes / mostly / no | Daily | Low-GI diets reduce HOMA-IR, fasting insulin, testosterone (meta-analysis RCTs) |
| Sugar / refined carb level | High / medium / low | Daily | Primary driver of hyperinsulinemia |
| Caffeine intake | None / 1 cup / 2+ cups | Daily (optional) | Worsens anxiety; interferes with sleep in sleep apnea-risk population |
| Alcohol | None / 1–2 drinks / 3+ drinks | Daily (optional) | Worsens IR; disrupts SHBG levels |
| Anti-inflammatory eating | Scale 1–5 | Weekly | Mediterranean-pattern: whole grains, legumes, fatty fish, nuts, colorful vegetables (Johns Hopkins PCOS diet guide) |
| Inositol supplement taken | Binary + dose | Daily (if using) | Tracks 40:1 Myo:DCI adherence |

---

### Module 8: Lab Values Vault

All values are manually entered from paper/digital lab reports. Stored with date. Trend-charted over time. HOMA-IR is auto-calculated when both fasting insulin and fasting glucose are entered.

| Lab Test | Units | PCOS Clinical Significance | Normal Range | PCOS Range |
|----------|-------|--------------------------|--------------|-----------|
| Total testosterone | ng/dL | Primary androgen excess marker | 6–86 ng/dL | Often >60–70; frank elevation >80–100 |
| Free testosterone | pg/mL | More sensitive than total T | 0.7–3.6 pg/mL | Elevated in most HA PCOS |
| DHEA-S | μg/dL | Adrenal androgen | 35–430 μg/dL | >200 common; >700 suggests adrenal tumor |
| LH | IU/L | Elevated LH drives androgen production | 2–15 IU/L (follicular) | Often elevated |
| FSH | IU/L | LH:FSH ratio denominator | 3–10 IU/L | Low-normal typical |
| LH:FSH ratio | Calculated | Classic PCOS marker | ~1:1 | >2:1 common; >3:1 more specific |
| Estradiol (E2) | pg/mL | Cycle phase confirmation | 12–150 pg/mL | Variable |
| Progesterone (mid-luteal) | ng/mL | Ovulation confirmation | >10 ng/mL = ovulation | <3 ng/mL = anovulatory |
| AMH | ng/mL | Large antral follicle pool marker | 1.0–3.5 ng/mL | >3.8–5.0 ng/mL elevated |
| Fasting insulin | μIU/mL | Direct hyperinsulinemia measure | <15 μIU/mL | >15–20 clinically significant |
| Fasting glucose | mg/dL | IR calculation input | 70–99 mg/dL | 100–125 = pre-diabetes |
| **HOMA-IR** | Calculated | **(insulin × glucose) ÷ 405** | <2.0 typical | ≥2.5 IR; ≥3.0 elevated; ≥4.0 severe |
| 2-hour glucose (75g OGTT) | mg/dL | **Preferred over fasting glucose for PCOS** (Endocrine Society) | <140 mg/dL | 140–199 = impaired GT; ≥200 = diabetes |
| HbA1c | % | Long-term glycemic control | <5.7% | 5.7–6.4% = pre-diabetes |
| TSH | mIU/L | Thyroid; hypothyroidism mimics PCOS | 0.4–4.0 mIU/L | Optimal <2.5 mIU/L |
| Prolactin | ng/mL | Hyperprolactinemia differential | <25 ng/mL | >25 warrants MRI pituitary |
| 17-OH Progesterone | ng/mL | Non-classic CAH screening | <2 ng/mL | >2 warrants ACTH stim test |
| SHBG | nmol/L | Insulin suppresses SHBG → more free testosterone | 40–120 nmol/L | <30–40 common in IR PCOS |
| Vitamin D (25-OH) | ng/mL | 67–85% of PCOS are deficient | >30 ng/mL = sufficient | <20 = deficiency |
| Total cholesterol | mg/dL | Cardiovascular risk (annual check) | <200 mg/dL | Monitor trend |
| LDL | mg/dL | Primary atherogenic lipoprotein | <100 mg/dL (optimal) | Monitor trend |
| HDL | mg/dL | Protective; often low in PCOS with IR | >50 mg/dL (women) | <50 = metabolic syndrome criterion |
| Triglycerides | mg/dL | Elevated in IR PCOS; metabolic syndrome marker | <150 mg/dL | >150 = metabolic syndrome criterion |
| CRP (C-reactive protein) | mg/L | Chronic inflammation marker | <1.0 mg/L | >3.0 = elevated inflammation |

---

### Module 9: Medication Tracking

Each medication has condition-specific side effect fields.

| Medication | Dose | Frequency | Side Effects Tracked |
|-----------|------|-----------|---------------------|
| Metformin | mg (500/1000/1500/2000) | Daily | GI: nausea / diarrhea / cramping (1–3); B12 deficiency flag (long-term) |
| Spironolactone | mg (25–200) | Daily | Blood pressure (required); dizziness; irregular bleeding; breast tenderness |
| OCP (Oral Contraceptive Pill) | Brand + timing | Daily | Breakthrough bleeding; mood changes (1–5); libido change (1–5); nausea |
| Letrozole | mg (2.5 / 5.0 / 7.5) | Per treatment cycle | Hot flashes; dizziness; cycle day of use |
| Clomiphene citrate | mg (50 / 100) | Per treatment cycle | Hot flashes; mood changes; visual disturbances (flag immediately) |
| Myo-inositol | mg (2000–4000/day) | Daily | GI tolerance (1–3) |
| D-chiro-inositol | mg | Daily | GI tolerance |
| Berberine | mg (400mg × 3) | Daily | GI: nausea, cramping |
| NAC (N-acetyl cysteine) | mg (1200–1800/day) | Daily | GI tolerance |
| Vitamin D supplement | IU | Daily | None significant |
| Omega-3 (fish oil / algae) | mg EPA+DHA | Daily | GI tolerance; fishy aftertaste |
| Chromium picolinate | μg (200–1000) | Daily | None significant at standard doses |
| Eflornithine cream (Vaniqa) | Application | Twice daily (topical) | Skin irritation; stinging; rash |
| Progesterone (prescribed) | mg or cream | Per cycle | Drowsiness; mood changes; breakthrough bleeding |

---

### Module 10: Hirsutism Tracking (Detailed)

| Field | Type | Frequency | Clinical Note |
|-------|------|-----------|--------------|
| mFG simplified zone score | 0–4 per 5 zones (face / chest / abdomen / arms / back) | Quarterly baseline + monthly trend | Ferriman-Gallwey clinical standard; ≥8 = hirsutism |
| Hirsutism photo log | Photo (encrypted, local-first only) | Monthly (optional) | Visual treatment response comparison; never synced without explicit permission |
| Hair removal sessions | Method (wax / thread / laser / electrolysis / shave / cream) | Per session | Removal method + zone |
| Time since last removal per zone | Days (calculated) | Continuous | Hair removal interval = growth rate proxy. Thread every 2wk → every 5wk = measurable spironolactone response |
| Laser / IPL session log | Date + session number + area | Per session | 8–12 sessions typical course; tracking expected |

---

### Module 11: Fertility Mode (Activated When "Trying to Conceive" Is Selected)

| Field | Type | Frequency | Clinical Note |
|-------|------|-----------|--------------|
| OPK brand + result | Brand + scale (0–9 for quantitative) | Daily during cycle | Standard OPK unreliable in PCOS; quantitative monitors (Mira, Inito) preferred |
| BBT (Basal Body Temperature) | °C or °F | Daily AM (before rising) | Thermal shift confirms ovulation; wearable sync preferred (Ava, TempDrop) |
| Cervical mucus observation | Dry / sticky / creamy / watery / egg-white | Daily | Multi-method ovulation detection |
| Intercourse timing | Binary | Daily | **Private, end-to-end encrypted, never exported under any circumstances** |
| PdG urine test | Positive / Negative | Day 7–10 post OPK peak | Best ovulation confirmation for PCOS — confirms egg release, not just LH surge |
| Ultrasound follicle monitoring | Number of follicles + sizes (mm) | Per scan (manual entry) | Entered from clinic report during ovulation induction cycles |
| Fertility treatment type + cycle day | Text + number | Daily (during treatment) | Letrozole / IUI / IVF cycle tracking |
| TTC cycle number | Number | Per cycle | Emotional context; app calibrates message sensitivity as time increases |
| Pregnancy test result | Positive / Negative / Not tested | Per cycle | End-cycle data point |

---

## Part 12: Every Feature We're Building

Organized by priority tier. P0 = must exist at launch. P1 = first 3 months. P2 = 3–6 months. P3 = longer horizon.

---

### TIER 1 — Foundation (Launch Day, P0)

| # | Feature | What It Does |
|---|---------|-------------|
| 1 | Irregular Cycle Support | Calendar that accepts any cycle length from 14 to 365+ days. Never predicts from a 28-day assumption. Never says "late." |
| 2 | PCOS Mood Module | Daily anxiety, depression, and irritability log. Pattern charts. Linked to cycle phase. PHQ-2 equivalent trigger for escalation prompt. |
| 3 | Androgen Symptom Tracker (Daily) | Daily log for acne (face + body), hirsutism (new growth), hair shedding, oily skin, scalp health. Monthly trend charts. |
| 4 | Ferriman-Gallwey Self-Assessment | Illustrated body diagram. 5 simplified zones. 0–4 per zone. Total mFG-equivalent score stored and trended. Quarterly. |
| 5 | Hair Shedding Tracker | Daily strand count log (4-category scale). Ludwig zone selection. Monthly chart. Optional photo comparison (local only). |
| 6 | Lab Values Vault | Manual entry for all 25 PCOS-relevant lab values. Trend charts per value. HOMA-IR auto-calculated. Plain-language interpretation. |
| 7 | HOMA-IR Calculator | Standalone: enter fasting insulin + fasting glucose → instant HOMA-IR with clinical context (<2.0 / 2.5+ / 3.0+ / 4.0+). Trended over time. |
| 8 | PCOS Medication Adherence Log | Daily check-in for all PCOS medications. Condition-specific side effect fields per medication. Custom medication builder. |
| 9 | Endometrial Hyperplasia Risk Flag | At 75 days without logged period: soft in-app card. At 90 days: definitive prompt to discuss progestogen protection. In-app only, never push notification. |
| 10 | Phase-Aware Home Screen | Opens to a screen whose tone, color, and copy match cycle phase (or neutral if cycle is irregular/unknown). Never cheerful in anovulatory distress. |
| 11 | 30-Second Daily Log | 5-tap log flow. Phase-contextual symptom chips. Completable on the worst day. Floating action button from any screen. |
| 12 | Cycle Calendar (Ring View) | Visual map of the cycle with symptom density. Anovulatory cycles displayed distinctly — not as "late periods." |
| 13 | Privacy-First Data Architecture | All health data on-device by default. No advertising SDKs. One-tap deletion. Export to JSON. Privacy dashboard in plain language. |
| 14 | Condition Profile Setup | 4-screen onboarding. Condition selection. Privacy pledge. Minimum cycle setup. No medical forms required. |

---

### TIER 2 — Intelligence Layer (Month 1–3, P1)

| # | Feature | What It Does |
|---|---------|-------------|
| 15 | Inositol Protocol Tracker | Dedicated 40:1 Myo:DCI protocol tracker with dose, timing, adherence, GI tolerance. 3-month ovulatory response trend. |
| 16 | Weight Tracking — Non-Punitive | Opt-in, user-initiated, hidden by default. No BMI. No goal weight. Shows user's own trend as metabolic signal alongside energy and waist trends. |
| 17 | Metabolic Syndrome Risk Tracker | Displays user's status across the 5 metabolic syndrome criteria (waist, BP, TG, HDL, glucose). Shows criteria met count. Framed as monitoring tool. |
| 18 | PCOS Physician Report | One-tap PDF: cycle history, androgen symptom trends, lab values table, medication log, HOMA-IR trend, mood summary. Physician-readable format. |
| 19 | Doctor Appointment Prep | Pre-appointment checklist by phenotype and tracking history. Which labs to request (based on Lab Vault gaps). Boundary-setting language for weight conversations. Auto-attaches physician report. |
| 20 | Fertility Mode | TTC toggle activates: BBT log, PdG test log, CM observations, intercourse timing (encrypted, never exported), ultrasound follicle entry, treatment cycle tracking. Multi-signal fertile window — never algorithmic. |
| 21 | Treatment Response Tracker | Monthly "how is your treatment working?" card. Side-by-side comparison: androgen symptoms, cycle regularity, mood, energy — 3 months ago vs. now. Shareable. |
| 22 | Pattern Recognition Engine | After 2 cycles: identifies personal patterns. Predictive signals with confidence rating. "3 more weeks to confirm this pattern." |
| 23 | Ora AI Insight Engine | Conversational AI companion. 1–2 personalized insights per week from user's data. Never diagnoses. Phase-aware tone rules. |
| 24 | Voice Diet Logging via Ora | Tell Ora what you ate — speech or text. Ora responds with glycemic quality + insulin impact + phase context. Never calories. ED safety guardrail. |
| 25 | Diet-Symptom Correlation Engine | After 30+ diet + symptom logs: surfaces personal patterns. "On high-sugar days, your fatigue score was 1.8 points higher the next morning." User's data only. |
| 26 | Phase Education Cards | Daily: what hormones/metabolic dynamics are active today in PCOS terms. How does this connect to what the user logged? Plain language. |
| 27 | Ovulation Detection Module | Multi-signal PCOS-aware tracking: OPK + CM + BBT + PdG on one chart. Flags LH surge without PdG confirmation (LH surge ≠ ovulation in PCOS). No algorithmic prediction. |
| 28 | Annual PCOS Health Review Prompt | At 12 months: which of the 9 annual monitoring tests have been logged? Pre-filled "ask your doctor for these" list. 12-month summary PDF. |
| 29 | Notification System (Phase-Aware) | Opt-in. Daily log reminder. Phase transition alert. Cycle length alert (no "late" language). Push suppressed during crisis-tier days. |
| 30 | Basic Insights Dashboard | Symptom charts by phase. Androgen symptom trend. Lab value trends. HOMA-IR over time. Metabolic snapshot. |
| 31 | Phase Transition Notifications | Personalized compassionate push at phase transitions. References user's personal data. Opt-in only. Irregular cycles handled gracefully. |

---

### TIER 3 — Platform Layer (Month 4–6, P2)

| # | Feature | What It Does |
|---|---------|-------------|
| 32 | Phenotype Identification Helper | After 60 days: suggests PCOS phenotype (A/B/C/D) based on symptom patterns, lab values, cycle regularity. Not a diagnosis — a pattern to discuss. Shows monitoring priorities for that phenotype. |
| 33 | Metabolic Snapshot (Proxy CGM) | Daily proxy IR monitor: post-meal energy + sugar craving intensity + post-meal brain fog. Weekly trend. Phase-correlated. No CGM required. |
| 34 | Ultrasound Result Vault | Manual entry for ultrasound findings: AFC per ovary, ovarian volume, dominant follicle, PCOM finding. Correlated with AMH trend. |
| 35 | Multi-Condition Physician Report | For PCOS + PMDD + ADHD users: one PDF covering all active modules, each section labeled for the relevant specialist. |
| 36 | Food Photo Analysis (Conditional) | Camera-based: photograph meal → Ora identifies items → glycemic quality + phase context. Never calories. Zero photo retention. 4 gate conditions must be met before shipping. |
| 37 | Community Matching (Same Phenotype) | Anonymous community matched by PCOS phenotype. Phenotype A content separated from Phenotype D. Moderated. No social feed. Opt-in. |

---

## Part 13: Features We Will NEVER Build for PCOS Users

| Feature | Why We Won't Build It |
|---------|----------------------|
| **Calorie counting or macro tracking** | PCOS has 4× the general population rate of eating disorders. Binge eating disorder is the most common. Calorie displays are a direct pathway to harm. We track glycemic quality and insulin impact — never calories. |
| **Goal weight / weight loss tracking** | Weight is a metabolic trend signal — not a goal. No "X lbs to target." No "progress toward goal weight." No weight loss challenges. The hyperinsulinemia in PCOS makes the standard calorie-in/calorie-out model physiologically incorrect for this population. |
| **BMI calculation or display** | BMI is clinically contested and systematically harmful for women, particularly PCOS users where fat distribution patterns differ from BMI assumptions. Lean women with PCOS are already dismissed because "you can't have PCOS, you're thin." BMI reinforces this harm. |
| **Standard 28-day ovulation prediction** | Clue's algorithm is clinically wrong for PCOS. An app predicting ovulation at day 14 for a woman with a 55-day cycle is not just useless — it causes harm (incorrect fertility timing, false reassurance for contraception). We never predict from a 28-day assumption. |
| **Social feed or public activity sharing** | Users are logging insulin resistance, hair loss, suicidal ideation, and body image distress. A social feed of this data creates comparison dynamics that are antithetical to the product's purpose. Community is anonymous, phenotype-segmented, and opt-in. |
| **Fertility prediction for contraception** | HormonaIQ is not a birth control app. OPK data in PCOS is too unreliable to support contraception decisions. We never imply that cycle or ovulation tracking in this app is sufficient for contraception. |
| **Advertising or data monetization** | Subscription only. No health data to ad networks. The Flo FTC settlement exists for a reason. Hormonal health data is among the most sensitive data a person generates. |
| **Streak counters or gamification** | A user who didn't log because she was exhausted from PCOS fatigue and insulin-driven fog for 3 days does not need a broken streak when she returns. Gamification that penalizes the symptom load is a design failure. |
| **Employer wellness integration** | Employers have legal standing to receive aggregate wellness data. Any integration creates a pathway for employer access to hormonal health data — an employment discrimination risk in the post-Roe legal environment. |
| **Pregnancy tracking** | Out of scope. If a user becomes pregnant during HormonaIQ use, we surface a message and suggest appropriate alternatives. No pregnancy module. |

---

*PCOS Primer v2.0 | HormonaIQ | April 2026*
*Sources: Rotterdam Criteria (ESHRE/ASRM 2003/2004), 2023 International Evidence-Based PCOS Guidelines (Teede et al.), Endocrine Society PCOS Patient Guide, RCOG Patient Information Leaflet 2022, AskPCOS.org (Monash University / PCOS Society), Johns Hopkins Medicine PCOS Diet Guide, JMIR MARS Study 2025 (PMC12187023), Ferriman-Gallwey Scale (PMC5514800), HOMA-IR clinical standard (Fertil Steril 2005), r/PCOS community data (3.2M members), r/PCOSloseit data, Diagnosis delay: BMC Women's Health 2023, PMC6283441*
