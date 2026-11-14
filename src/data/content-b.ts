import type { AlgorithmId } from "../lib/ciphers";
import type { AlgoContent, Localized } from "./types";

export const contentB: Partial<Record<AlgorithmId, Localized<AlgoContent>>> = {
  /* ===================== 7 · COLUMNAR TRANSPOSITION ===================== */
  columnar: {
    en: {
      name: "Columnar Transposition",
      tagline: "Write in rows, read in columns — a keyword reorders the grid.",
      history:
        "Used extensively from the late 19th century through both World Wars, often as the outer layer of compound systems such as the German ADFGVX cipher. Double and triple columnar transpositions were field-standard well into the 1950s.",
      what: [
        "The message is written into a rectangular grid row by row, then read out column by column in the order dictated by a keyword. Alphabetically sorting the keyword letters gives each column a rank, and the columns are emitted in rank order.",
        "Nothing about the letters changes — only their positions. This makes columnar transposition a pure diffusion device: it scrambles the relationships between neighbouring symbols.",
      ],
      how: [
        { title: "Number the key columns", body: "Sort the letters of the keyword alphabetically. The position each original column occupies in that sorted list is its rank.", math: "Z E B R A → sorted A B E R Z → ranks 4 2 0 3 1" },
        { title: "Fill the grid by rows", body: "Write the plaintext left to right, one row at a time. If the final row is incomplete, pad it (with X) or leave it short.", math: "rows = ⌈n / cols⌉" },
        { title: "Read the grid by columns", body: "Emit column rank 0 first, then rank 1, and so on, concatenating each column top to bottom.", math: "C = col₍r₀₎ ‖ col₍r₁₎ ‖ …" },
        { title: "Decrypt by recomputing column lengths", body: "Work out how many characters each column must have contained, cut the ciphertext into those exact lengths in rank order, place them back into the grid, then read row by row.", math: "len[j] = rows − (j ≥ n mod cols ? 1 : 0)" },
      ],
      formula: {
        display: "rank(j) = position of key[j] in sorted(key)\nC = ‖ over j sorted by rank : grid[0..rows−1][j]",
        caption: "Row-wise writing, column-wise reading in keyword order",
        symbols: [
          { sym: "key", meaning: "the keyword that determines the column order" },
          { sym: "rank(j)", meaning: "the order in which column j is read out" },
          { sym: "rows", meaning: "⌈message length / keyword length⌉" },
          { sym: "‖", meaning: "concatenation" },
        ],
      },
      example: {
        plaintext: "HELLOWORLD",
        keyLabel: "Keyword",
        keyValue: "ZEBRA",
        steps: [
          { title: "Rank the key", body: "Sort Z E B R A alphabetically: A B E R Z. The columns are therefore read in the order A, B, E, R, Z — which are columns 5, 3, 2, 4, 1.", math: "A=col5  B=col3  E=col2  R=col4  Z=col1" },
          { title: "Fill the grid by rows", body: "10 letters across 5 columns gives exactly two full rows, so no padding is needed here.", math: "H E L L O\nW O R L D" },
          { title: "Read column A (the 5th)", body: "Take it top to bottom.", math: "O D → OD" },
          { title: "Read column B (the 3rd)", body: "Then the next column in alphabetical key order.", math: "L R → LR" },
          { title: "Read columns E, R, Z", body: "That is columns 2, 4 and 1, in this order.", math: "EO   LL   HW" },
          { title: "Concatenate", body: "The ciphertext is the five columns glued together in rank order. Decryption reverses it by recomputing each column's length.", math: "OD + LR + EO + LL + HW" },
        ],
        ciphertext: "ODLREOLLHW",
      },
      strengths: [
        "Strong diffusion — adjacent plaintext letters end up far apart in the ciphertext.",
        "Keyword length scales the keyspace factorially: n! possible column orders.",
        "Combines beautifully with substitution to form a product cipher (confusion + diffusion).",
        "Works on any alphabet, digits and symbols included.",
      ],
      weaknesses: [
        "Letter frequencies are untouched, which immediately identifies it as a transposition.",
        "Vulnerable to anagramming: permute small blocks of ciphertext until real words appear.",
        "If the message length is a multiple of the key length, the grid is regular and the attack is far easier.",
        "Known plaintext of moderate length recovers the column order directly.",
      ],
      attacks: [
        { name: "Anagramming / block permutation", desc: "Slide and permute windows of the ciphertext, scoring each candidate against language bigram statistics.", cost: "seconds–minutes" },
        { name: "Multiple anagramming", desc: "If two messages used the same key, solve them simultaneously — the shared column order falls out.", cost: "fast" },
        { name: "Key-length search", desc: "Try every keyword length and, for each, every column permutation, scoring with a language model.", cost: "factorial, but tractable for short keys" },
      ],
      verdict:
        "Columnar transposition is the textbook diffusion primitive. On its own it delays rather than defeats an attacker, but stacked with substitution it produced some of the hardest field ciphers of the 20th century.",
      lab: {
        inputPlaceholder: "Type the message to lay into the grid…",
        presets: [
          { label: "Short", value: "HELLO WORLD" },
          { label: "Wartime", value: "CONVOY DEPARTS AT MIDNIGHT ESCORT REQUIRED" },
          { label: "Exact fit", value: "THEGRIDISFULLNOW" },
        ],
      },
    },
    ar: {
      name: "التبديل العمودي",
      tagline: "اكتب في صفوف واقرأ في أعمدة — كلمة المفتاح تعيد ترتيب الشبكة.",
      history:
        "استُخدمت على نطاق واسع من أواخر القرن التاسع عشر وحتى الحربين العالميتين، غالبًا كطبقة خارجية في أنظمة مركّبة مثل شيفرة ADFGVX الألمانية. وظل التبديل العمودي المزدوج والثلاثي معيارًا ميدانيًا حتى الخمسينيات.",
      what: [
        "تُكتب الرسالة في شبكة مستطيلة صفًا بعد صف، ثم تُقرأ عمودًا بعد عمود بالترتيب الذي تحدده كلمة المفتاح. فترتيب أحرف الكلمة أبجديًا يعطي كل عمود رتبة، وتُصدر الأعمدة حسب هذه الرتب.",
        "ولا يتغير في الأحرف شيء — بل مواقعها فقط. ولهذا يُعد التبديل العمودي أداة انتشار خالصة: فهو يبعثر العلاقات بين الرموز المتجاورة.",
      ],
      how: [
        { title: "رقّم أعمدة المفتاح", body: "رتّب أحرف كلمة المفتاح أبجديًا. الموقع الذي يحتله كل عمود أصلي في القائمة المرتّبة هو رتبته.", math: "Z E B R A → sorted A B E R Z → ranks 4 2 0 3 1" },
        { title: "املأ الشبكة بالصفوف", body: "اكتب النص الأصلي من اليسار لليمين صفًا صفًا. وإذا كان الصف الأخير ناقصًا فاحشُه بحرف X أو اتركه ناقصًا.", math: "rows = ⌈n / cols⌉" },
        { title: "اقرأ الشبكة بالأعمدة", body: "أصدر العمود ذا الرتبة 0 أولًا ثم 1 وهكذا، موصلًا كل عمود من أعلى إلى أسفل.", math: "C = col₍r₀₎ ‖ col₍r₁₎ ‖ …" },
        { title: "فكّ التشفير بإعادة حساب أطوال الأعمدة", body: "احسب عدد الأحرف التي كان يحتويها كل عمود، وقصّ النص المشفَّر بهذه الأطوال بالضبط حسب الرتب، وأعد وضعها في الشبكة، ثم اقرأ صفًا صفًا.", math: "len[j] = rows − (j ≥ n mod cols ? 1 : 0)" },
      ],
      formula: {
        display: "rank(j) = position of key[j] in sorted(key)\nC = ‖ over j sorted by rank : grid[0..rows−1][j]",
        caption: "كتابة صفّية وقراءة عمودية بترتيب كلمة المفتاح",
        symbols: [
          { sym: "key", meaning: "كلمة المفتاح التي تحدد ترتيب الأعمدة" },
          { sym: "rank(j)", meaning: "الترتيب الذي يُقرأ به العمود j" },
          { sym: "rows", meaning: "⌈طول الرسالة ÷ طول كلمة المفتاح⌉" },
          { sym: "‖", meaning: "عملية التوصيل" },
        ],
      },
      example: {
        plaintext: "HELLOWORLD",
        keyLabel: "كلمة المفتاح",
        keyValue: "ZEBRA",
        steps: [
          { title: "رتّب المفتاح", body: "رتّب Z E B R A أبجديًا فتصبح A B E R Z. إذن تُقرأ الأعمدة بالترتيب A ثم B ثم E ثم R ثم Z، أي الأعمدة 5 و3 و2 و4 و1.", math: "A=col5  B=col3  E=col2  R=col4  Z=col1" },
          { title: "املأ الشبكة بالصفوف", body: "عشرة أحرف على 5 أعمدة تعطي صفّين كاملين بالضبط، فلا حاجة للحشو هنا.", math: "H E L L O\nW O R L D" },
          { title: "اقرأ عمود A (الخامس)", body: "من أعلى إلى أسفل.", math: "O D → OD" },
          { title: "اقرأ عمود B (الثالث)", body: "ثم العمود التالي حسب الترتيب الأبجدي للمفتاح.", math: "L R → LR" },
          { title: "اقرأ الأعمدة E و R و Z", body: "أي الأعمدة 2 و4 و1 بهذا الترتيب.", math: "EO   LL   HW" },
          { title: "اوصل النتائج", body: "النص المشفَّر هو الأعمدة الخمسة ملصوقة حسب رتبها. وفك التشفير يعكس العملية بإعادة حساب طول كل عمود.", math: "OD + LR + EO + LL + HW" },
        ],
        ciphertext: "ODLREOLLHW",
      },
      strengths: [
        "انتشار قوي — الحروف المتجاورة في الأصل تتباعد في النص المشفَّر.",
        "فضاء المفاتيح ينمو عامليًا مع طول الكلمة: n! ترتيب ممكن للأعمدة.",
        "تتراكب بجمال مع الاستبدال لتكوين شيفرة مركّبة (تشويش + انتشار).",
        "تعمل مع أي أبجدية وأي أرقام ورموز.",
      ],
      weaknesses: [
        "تكرارات الأحرف لا تتغير، ما يثبت فورًا أنها شيفرة تبديل.",
        "عرضة لإعادة الترتيب: بادِل مقاطع صغيرة من النص المشفَّر حتى تظهر كلمات حقيقية.",
        "إذا كان طول الرسالة مضاعفًا لطول المفتاح تصبح الشبكة منتظمة ويصير الهجوم أسهل بكثير.",
        "نص معروف بطول متوسط يستعيد ترتيب الأعمدة مباشرة.",
      ],
      attacks: [
        { name: "إعادة الترتيب", desc: "حرّك وبادِل نوافذ من النص المشفَّر وقيّم كل مرشح بإحصاءات الأزواج اللغوية.", cost: "ثوانٍ إلى دقائق" },
        { name: "إعادة ترتيب متعددة", desc: "إذا استُخدم نفس المفتاح في رسالتين فحلهما معًا يكشف ترتيب الأعمدة المشترك.", cost: "سريع" },
        { name: "البحث عن طول المفتاح", desc: "جرّب كل طول مفتاح وكل تبديل للأعمدة مع تقييم بنموذج لغوي.", cost: "عاملي لكنه ممكن للمفاتيح القصيرة" },
      ],
      verdict:
        "التبديل العمودي هو لبنة الانتشار في كل الكتب الدراسية. وحده يؤخّر المهاجم ولا يهزمه، لكنه عند تركيبه مع الاستبدال أنتج بعض أصعب الشيفرات الميدانية في القرن العشرين.",
      lab: {
        inputPlaceholder: "اكتب الرسالة لتُفرش داخل الشبكة…",
        presets: [
          { label: "قصير", value: "HELLO WORLD" },
          { label: "زمن الحرب", value: "CONVOY DEPARTS AT MIDNIGHT ESCORT REQUIRED" },
          { label: "شبكة ممتلئة", value: "THEGRIDISFULLNOW" },
        ],
      },
    },
  },

  /* ============================ 8 · AFFINE ============================ */
  affine: {
    en: {
      name: "Affine Cipher",
      tagline: "A linear function over the alphabet — multiply, add, reduce.",
      history:
        "The affine cipher generalises Caesar into a full mathematical form and belongs to the family of monoalphabetic substitution ciphers studied formally in the 19th and 20th centuries. It is the standard classroom bridge between classical ciphers and modular arithmetic.",
      what: [
        "Each letter index x is transformed by a linear function: multiply by a, add b, then reduce modulo 26. The pair (a, b) is the key. Caesar is the special case a = 1; Atbash is a = 25, b = 25.",
        "The multiplication is what makes it interesting — and restrictive. For decryption to be possible, a must have a multiplicative inverse modulo 26, which means gcd(a, 26) must equal 1. Only 12 of the 26 values of a qualify.",
      ],
      how: [
        { title: "Choose a valid a", body: "a must be coprime with 26, so a ∈ {1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25}. Any other value collapses several letters onto the same output and makes decryption impossible.", math: "gcd(a, 26) = 1" },
        { title: "Apply the linear map", body: "Multiply the letter index by a, add the offset b, and take the remainder modulo 26.", math: "E(x) = (a·x + b) mod 26" },
        { title: "Find a⁻¹ for decryption", body: "Use the extended Euclidean algorithm to find the number that satisfies a·a⁻¹ ≡ 1 (mod 26).", math: "a·a⁻¹ ≡ 1 (mod 26)" },
        { title: "Invert the function", body: "Subtract b, multiply by a⁻¹, and reduce.", math: "D(y) = a⁻¹·(y − b) mod 26" },
      ],
      formula: {
        display: "E(x) = (a·x + b) mod 26\nD(y) = (a⁻¹·(y − b)) mod 26,   a⁻¹·a ≡ 1 (mod 26)",
        caption: "A bijection on ℤ₂₆ exists only when a is invertible modulo 26",
        symbols: [
          { sym: "x", meaning: "plaintext letter index" },
          { sym: "y", meaning: "ciphertext letter index" },
          { sym: "a", meaning: "multiplier, must satisfy gcd(a, 26) = 1" },
          { sym: "b", meaning: "additive offset, any value 0–25" },
          { sym: "a⁻¹", meaning: "modular multiplicative inverse of a" },
        ],
      },
      example: {
        plaintext: "AFFINE",
        keyLabel: "Key pair",
        keyValue: "a = 5, b = 8",
        steps: [
          { title: "Check that a is invertible", body: "gcd(5, 26) = 1, so 5 is valid. Its inverse is 21 because 5 × 21 = 105 = 4×26 + 1.", math: "5 × 21 ≡ 1 (mod 26)" },
          { title: "Encrypt A", body: "A = 0 → (5×0 + 8) mod 26 = 8 → I.", math: "E(0) = 8 = I" },
          { title: "Encrypt F", body: "F = 5 → (5×5 + 8) mod 26 = 33 mod 26 = 7 → H.", math: "E(5) = 7 = H" },
          { title: "Encrypt the rest", body: "F→H, I→1 (since (5×8+8)=48 mod 26 = 22 → W), N→(5×13+8)=73 mod 26=21→V, E→(5×4+8)=28 mod 26=2→C.", math: "A F F I N E → I H H W V C" },
          { title: "Decrypt back", body: "For H(7): 21×(7−8) = −21 ≡ 5 (mod 26) → F. The round trip closes.", math: "D(7) = 21·(7−8) mod 26 = 5 = F" },
        ],
        ciphertext: "IHHWVC",
      },
      strengths: [
        "A clean, complete illustration of modular arithmetic, bijections and modular inverses.",
        "Larger keyspace than Caesar: 12 × 26 = 312 keys.",
        "Generalises both Caesar (a=1) and Atbash (a=25, b=25) inside one formula.",
        "Deterministic and fast, with a trivially provable invertibility condition.",
      ],
      weaknesses: [
        "Still monoalphabetic — every plaintext letter always maps to the same ciphertext letter.",
        "Frequency analysis breaks it exactly as it breaks Caesar.",
        "Only 312 keys: exhaustive search finishes in microseconds.",
        "Invalid values of a silently destroy information, a classic implementation pitfall.",
      ],
      attacks: [
        { name: "Frequency analysis", desc: "Match the ciphertext histogram to the language histogram; solve the resulting two linear equations for a and b.", cost: "minutes" },
        { name: "Exhaustive key search", desc: "Try all 312 (a, b) pairs and score each output with a language model.", cost: "microseconds" },
        { name: "Two-letter crib", desc: "Two known plaintext/ciphertext letter pairs give two equations in two unknowns — a and b are solved directly.", cost: "instant" },
      ],
      verdict:
        "Affine is the mathematically honest version of Caesar. Its real lesson is the invertibility condition: without gcd(a, 26) = 1 there is no decryption at all, which is the first taste of why number theory underpins cryptography.",
      lab: {
        inputPlaceholder: "Type text and pick a multiplier coprime with 26…",
        presets: [
          { label: "Textbook", value: "AFFINE CIPHER" },
          { label: "Sentence", value: "NUMBER THEORY IS THE QUEEN OF MATHEMATICS" },
          { label: "Mixed", value: "Meet me at 7 PM, bring the KEY!" },
        ],
      },
    },
    ar: {
      name: "الشيفرة التآلفية",
      tagline: "دالة خطية على الأبجدية — اضرب واجمع ثم خذ باقي القسمة.",
      history:
        "تُعمّم الشيفرة التآلفية شيفرة قيصر في صورة رياضية كاملة، وتنتمي إلى عائلة شيفرات الاستبدال أحادية الأبجدية التي دُرست منهجيًا في القرنين التاسع عشر والعشرين. وهي الجسر التعليمي المعتمد بين الشيفرات الكلاسيكية والحساب النمطي.",
      what: [
        "يتحول رقم كل حرف x بدالة خطية: نضرب في a ثم نضيف b ثم نأخذ باقي القسمة على 26. والزوج (a, b) هو المفتاح. وشيفرة قيصر هي الحالة الخاصة a = 1، وأتباش هي a = 25 و b = 25.",
        "والضرب هو ما يجعلها مثيرة — ومقيِّدة في الوقت نفسه. فلكي يكون فك التشفير ممكنًا يجب أن يكون لـ a معكوس ضربي modulo 26، أي أن gcd(a, 26) = 1. و12 قيمة فقط من أصل 26 تحقق هذا الشرط.",
      ],
      how: [
        { title: "اختر قيمة صالحة لـ a", body: "يجب أن تكون a أولية نسبيًا مع 26، أي a ∈ {1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25}. أي قيمة أخرى تُسقط عدة أحرف على نفس الناتج وتجعل فك التشفير مستحيلًا.", math: "gcd(a, 26) = 1" },
        { title: "طبّق الدالة الخطية", body: "اضرب رقم الحرف في a وأضف الإزاحة b ثم خذ الباقي modulo 26.", math: "E(x) = (a·x + b) mod 26" },
        { title: "احسب a⁻¹ لفك التشفير", body: "استخدم خوارزمية إقليدس الموسعة لإيجاد العدد الذي يحقق a·a⁻¹ ≡ 1 (mod 26).", math: "a·a⁻¹ ≡ 1 (mod 26)" },
        { title: "اعكس الدالة", body: "اطرح b ثم اضرب في a⁻¹ ثم خذ الباقي.", math: "D(y) = a⁻¹·(y − b) mod 26" },
      ],
      formula: {
        display: "E(x) = (a·x + b) mod 26\nD(y) = (a⁻¹·(y − b)) mod 26,   a⁻¹·a ≡ 1 (mod 26)",
        caption: "لا توجد دالة تقابلية على ℤ₂₆ إلا إذا كانت a قابلة للعكس modulo 26",
        symbols: [
          { sym: "x", meaning: "رقم حرف النص الأصلي" },
          { sym: "y", meaning: "رقم حرف النص المشفَّر" },
          { sym: "a", meaning: "المعامل الضربي، ويجب أن يحقق gcd(a, 26) = 1" },
          { sym: "b", meaning: "الإزاحة الجمعية، أي قيمة من 0 إلى 25" },
          { sym: "a⁻¹", meaning: "المعكوس الضربي النمطي للعدد a" },
        ],
      },
      example: {
        plaintext: "AFFINE",
        keyLabel: "زوج المفتاح",
        keyValue: "a = 5, b = 8",
        steps: [
          { title: "تحقق من قابلية a للعكس", body: "gcd(5, 26) = 1 إذن 5 صالحة. ومعكوسها 21 لأن 5 × 21 = 105 = 4×26 + 1.", math: "5 × 21 ≡ 1 (mod 26)" },
          { title: "شفّر A", body: "A = 0 فتصبح (5×0 + 8) mod 26 = 8 أي الحرف I.", math: "E(0) = 8 = I" },
          { title: "شفّر F", body: "F = 5 فتصبح (5×5 + 8) mod 26 = 33 mod 26 = 7 أي الحرف H.", math: "E(5) = 7 = H" },
          { title: "شفّر البقية", body: "I→(5×8+8)=48 mod 26=22→W، و N→(5×13+8)=73 mod 26=21→V، و E→(5×4+8)=28 mod 26=2→C.", math: "A F F I N E → I H H W V C" },
          { title: "فكّ التشفير للتحقق", body: "للحرف H(7): 21×(7−8) = −21 ≡ 5 (mod 26) أي F. وهكذا تكتمل الدورة.", math: "D(7) = 21·(7−8) mod 26 = 5 = F" },
        ],
        ciphertext: "IHHWVC",
      },
      strengths: [
        "شرح نظيف وكامل للحساب النمطي والدوال التقابلية والمعكوس النمطي.",
        "فضاء مفاتيح أكبر من قيصر: 12 × 26 = 312 مفتاحًا.",
        "تُعمّم قيصر (a=1) وأتباش (a=25, b=25) داخل صيغة واحدة.",
        "حتمية وسريعة، بشرط قابلية للعكس يمكن إثباته بسهولة.",
      ],
      weaknesses: [
        "ما زالت أحادية الأبجدية — كل حرف أصلي يُنتج نفس الحرف المشفَّر دائمًا.",
        "تحليل التكرار يكسرها تمامًا كما يكسر قيصر.",
        "312 مفتاحًا فقط: البحث الشامل ينتهي في أجزاء من الميكروثانية.",
        "قيم a غير الصالحة تدمّر المعلومات بصمت، وهو فخّ برمجي كلاسيكي.",
      ],
      attacks: [
        { name: "تحليل التكرار", desc: "طابق مدرّج النص المشفَّر مع مدرّج اللغة ثم حلّ المعادلتين الخطيتين الناتجتين لإيجاد a و b.", cost: "دقائق" },
        { name: "البحث الشامل", desc: "جرّب كل الأزواج الـ312 وقيّم كل ناتج بنموذج لغوي.", cost: "ميكروثوانٍ" },
        { name: "قريب من حرفين", desc: "زوجان معروفان من (أصلي/مشفر) يعطيان معادلتين في مجهولين فيُحلاّن مباشرة.", cost: "فوري" },
      ],
      verdict:
        "التآلفية هي النسخة الرياضية الصريحة من قيصر. ودرسها الحقيقي هو شرط قابلية العكس: بدون gcd(a, 26) = 1 لا يوجد فك تشفير من الأساس، وهذه أول جرعة من فهم أن نظرية الأعداد هي أساس التشفير.",
      lab: {
        inputPlaceholder: "اكتب نصًا واختر معاملًا أوليًا نسبيًا مع 26…",
        presets: [
          { label: "كتابي", value: "AFFINE CIPHER" },
          { label: "جملة", value: "NUMBER THEORY IS THE QUEEN OF MATHEMATICS" },
          { label: "مختلط", value: "Meet me at 7 PM, bring the KEY!" },
        ],
      },
    },
  },

  /* ============================== 9 · HILL ============================== */
  hill: {
    en: {
      name: "Hill Cipher",
      tagline: "Linear algebra as a cipher — a matrix swallows whole blocks of letters.",
      history:
        "Invented by Lester S. Hill in 1929 and published in the American Mathematical Monthly. It was the first practical cipher to process several symbols at once using matrix multiplication, and it influenced the design of modern block ciphers including the mixing layers of AES.",
      what: [
        "Hill takes the message in blocks of n letters, converts each block into a column vector of numbers, multiplies it by an n×n key matrix, and reduces every entry modulo 26. The result is the ciphertext block.",
        "Because each output letter depends on all n input letters of its block, single-letter frequency analysis is completely destroyed. This is polygraphic substitution — and it is the conceptual ancestor of the modern block cipher.",
      ],
      how: [
        { title: "Choose the matrix size n", body: "n = 2 processes letters in pairs (676 combinations), n = 3 in triples (17,576). Larger n means stronger diffusion and slower hand computation.", math: "M ∈ ℤ₂₆ⁿˣⁿ" },
        { title: "Split into blocks and pad", body: "Convert the message to letters only, then split it into blocks of n. If the last block is short, pad it with X.", math: "P = [p₁ p₂ … pₙ]ᵀ" },
        { title: "Multiply and reduce", body: "Each ciphertext letter is a dot product of one matrix row with the plaintext vector, taken modulo 26.", math: "C = M·P mod 26" },
        { title: "Decrypt with the inverse matrix", body: "Compute M⁻¹ modulo 26 using the adjugate matrix divided by the determinant — the determinant must be invertible mod 26.", math: "P = M⁻¹·C mod 26,  M⁻¹ = det(M)⁻¹ · adj(M)" },
      ],
      formula: {
        display: "C = M · P mod 26\nP = M⁻¹ · C mod 26\nM⁻¹ = det(M)⁻¹ · adj(M) mod 26,   gcd(det M, 26) = 1",
        caption: "Matrix multiplication over the ring ℤ₂₆",
        symbols: [
          { sym: "M", meaning: "the n×n key matrix with entries in ℤ₂₆" },
          { sym: "P", meaning: "plaintext block as a column vector" },
          { sym: "C", meaning: "ciphertext block as a column vector" },
          { sym: "det(M)", meaning: "determinant; must be coprime with 26" },
          { sym: "adj(M)", meaning: "adjugate (transposed cofactor) matrix" },
        ],
      },
      example: {
        plaintext: "HI THERE",
        keyLabel: "2×2 key matrix",
        keyValue: "M = [[3, 3], [2, 5]]",
        steps: [
          { title: "Verify the determinant", body: "det = 3×5 − 3×2 = 15 − 6 = 9. gcd(9, 26) = 1, so 9 has an inverse mod 26 — it is 3, because 9×3 = 27 ≡ 1.", math: "det = 9,  9⁻¹ ≡ 3 (mod 26)" },
          { title: "Prepare the blocks", body: "Remove spaces and split into pairs; the odd final letter is padded with X.", math: "HI  TH  ER  EX" },
          { title: "Encrypt HI", body: "H=7, I=8. Row 1: 3×7 + 3×8 = 45 mod 26 = 19 → T. Row 2: 2×7 + 5×8 = 54 mod 26 = 2 → C.", math: "[[3,3],[2,5]]·[7,8]ᵀ = [19,2]ᵀ → TC" },
          { title: "Continue with TH", body: "T=19, H=7 → 3×19 + 3×7 = 78 mod 26 = 0 → A; 2×19 + 5×7 = 73 mod 26 = 21 → V.", math: "[19,7]ᵀ → [0,21]ᵀ → AV" },
          { title: "Finish the message", body: "ER → LP and the padded block EX → DT.", math: "HI THERE → TCAVLPDT" },
          { title: "Decrypt", body: "M⁻¹ = det⁻¹ · adj(M) mod 26 = 3 · [[5, −3], [−2, 3]] mod 26. Multiplying each ciphertext block by M⁻¹ returns the plaintext.", math: "P = M⁻¹·C mod 26" },
        ],
        ciphertext: "TCAVLPDT",
      },
      strengths: [
        "Polygraphic: each ciphertext letter depends on the whole block, killing single-letter frequency analysis.",
        "Keyspace grows explosively — the number of invertible n×n matrices over ℤ₂₆ is enormous even for n = 3.",
        "Genuine linear algebra in practice: determinants, adjugates, modular inverses.",
        "Direct conceptual ancestor of the MixColumns diffusion layer in AES.",
      ],
      weaknesses: [
        "Completely linear — a known-plaintext attack solves the key matrix with n² equations using Gaussian elimination mod 26.",
        "Only 26 letters per block position, so patterns across blocks can still leak.",
        "A singular matrix (det ≡ 0 or not coprime with 26) is unusable; careless key generation fails silently.",
        "Padding with X reveals message length and leaves a fingerprint.",
      ],
      attacks: [
        { name: "Known-plaintext linear solve", desc: "n linearly independent plaintext/ciphertext block pairs give M directly by inverting the plaintext matrix mod 26.", cost: "instant with n blocks" },
        { name: "Digraph/trigraph frequency", desc: "For n=2, match the most common ciphertext pairs against the most common plaintext pairs.", cost: "minutes" },
        { name: "Chosen plaintext", desc: "Feeding the identity-like vectors e₁…eₙ reveals each column of the key matrix one at a time.", cost: "n encryptions" },
      ],
      verdict:
        "Hill is the most mathematically beautiful classical cipher and the most instructive warning: linearity is a fatal flaw. It shows exactly why modern ciphers must mix linear diffusion with non-linear confusion.",
      lab: {
        inputPlaceholder: "Type letters only; they will be blocked into vectors…",
        presets: [
          { label: "Pairs", value: "HILL CIPHER BLOCKS" },
          { label: "Odd length", value: "LINEAR ALGEBRA" },
          { label: "Long", value: "MATRIX MULTIPLICATION MODULO TWENTY SIX" },
        ],
      },
    },
    ar: {
      name: "شيفرة هيل",
      tagline: "الجبر الخطي كشيفرة — مصفوفة تبتلع كتلًا كاملة من الحروف.",
      history:
        "اخترعها ليستر هيل عام 1929 ونشرها في مجلة American Mathematical Monthly. وكانت أول شيفرة عملية تعالج عدة رموز دفعة واحدة بضرب المصفوفات، وأثّرت في تصميم الشيفرات الكتلية الحديثة بما فيها طبقات الخلط في AES.",
      what: [
        "تأخذ هيل الرسالة في كتل من n أحرف، وتحول كل كتلة إلى متجه عمودي من الأرقام، ثم تضربه في مصفوفة مفتاح n×n وتختزل كل عنصر modulo 26. والناتج هو كتلة النص المشفَّر.",
        "ولأن كل حرف ناتج يعتمد على كل أحرف الكتلة المدخلة، ينهار تحليل تكرار الحرف الواحد تمامًا. وهذا هو الاستبدال متعدد الرموز — وهو السلف المفاهيمي المباشر للشيفرة الكتلية الحديثة.",
      ],
      how: [
        { title: "اختر حجم المصفوفة n", body: "n = 2 تعالج الأحرف أزواجًا (676 تركيبة)، و n = 3 تعالجها ثلاثيات (17,576). وكلما زاد n قوي الانتشار وبطؤ الحساب اليدوي.", math: "M ∈ ℤ₂₆ⁿˣⁿ" },
        { title: "قسّم إلى كتل واحشُ", body: "حوّل الرسالة إلى أحرف فقط ثم قسّمها إلى كتل من n. وإذا كانت الكتلة الأخيرة ناقصة فاحشُها بحرف X.", math: "P = [p₁ p₂ … pₙ]ᵀ" },
        { title: "اضرب واختزِل", body: "كل حرف مشفَّر هو ضرب نقطي لصف من المصفوفة في متجه النص الأصلي modulo 26.", math: "C = M·P mod 26" },
        { title: "فكّ التشفير بالمصفوفة العكسية", body: "احسب M⁻¹ modulo 26 باستخدام المصفوفة المصاحبة مقسومة على المحدد — ويجب أن يكون المحدد قابلًا للعكس mod 26.", math: "P = M⁻¹·C mod 26,  M⁻¹ = det(M)⁻¹ · adj(M)" },
      ],
      formula: {
        display: "C = M · P mod 26\nP = M⁻¹ · C mod 26\nM⁻¹ = det(M)⁻¹ · adj(M) mod 26,   gcd(det M, 26) = 1",
        caption: "ضرب مصفوفات فوق الحلقة ℤ₂₆",
        symbols: [
          { sym: "M", meaning: "مصفوفة المفتاح n× بعناصر من ℤ₂₆" },
          { sym: "P", meaning: "كتلة النص الأصلي كمتجه عمودي" },
          { sym: "C", meaning: "كتلة النص المشفَّر كمتجه عمودي" },
          { sym: "det(M)", meaning: "المحدد؛ يجب أن يكون أوليًا نسبيًا مع 26" },
          { sym: "adj(M)", meaning: "المصفوفة المصاحبة (منقولة مصفوفة العوامل المرافقة)" },
        ],
      },
      example: {
        plaintext: "HI THERE",
        keyLabel: "مصفوفة مفتاح 2×2",
        keyValue: "M = [[3, 3], [2, 5]]",
        steps: [
          { title: "تحقق من المحدد", body: "det = 3×5 − 3×2 = 15 − 6 = 9. وبما أن gcd(9, 26) = 1 فإن لـ9 معكوسًا mod 26 وهو 3، لأن 9×3 = 27 ≡ 1.", math: "det = 9,  9⁻¹ ≡ 3 (mod 26)" },
          { title: "جهّز الكتل", body: "احذف المسافات وقسّم إلى أزواج؛ والحرف الأخير المنفرد يُحشى بـ X.", math: "HI  TH  ER  EX" },
          { title: "شفّر HI", body: "H=7 و I=8. الصف الأول: 3×7 + 3×8 = 45 mod 26 = 19 أي T. الصف الثاني: 2×7 + 5×8 = 54 mod 26 = 2 أي C.", math: "[[3,3],[2,5]]·[7,8]ᵀ = [19,2]ᵀ → TC" },
          { title: "أكمل مع TH", body: "T=19 و H=7 فتصبح 3×19 + 3×7 = 78 mod 26 = 0 أي A، و 2×19 + 5×7 = 73 mod 26 = 21 أي V.", math: "[19,7]ᵀ → [0,21]ᵀ → AV" },
          { title: "أنهِ الرسالة", body: "ER تعطي LP، والكتلة المحشوّة EX تعطي DT.", math: "HI THERE → TCAVLPDT" },
          { title: "فكّ التشفير", body: "M⁻¹ = det⁻¹ · adj(M) mod 26 = 3 · [[5, −3], [−2, 3]] mod 26، وضرب كل كتلة مشفَّرة في M⁻¹ يعيد النص الأصلي.", math: "P = M⁻¹·C mod 26" },
        ],
        ciphertext: "TCAVLPDT",
      },
      strengths: [
        "متعددة الرموز: كل حرف مشفَّر يعتمد على الكتلة كلها، فينهار تحليل تكرار الحرف الواحد.",
        "فضاء المفاتيح ينفجر نموًا — عدد المصفوفات القابلة للعكس n×n فوق ℤ₂₆ هائل حتى عند n = 3.",
        "جبر خطي حقيقي عمليًا: محددات ومصفوفات مصاحبة ومعكوسات نمطية.",
        "السلف المباشر لطبقة MixColumns الانتشارية في AES.",
      ],
      weaknesses: [
        "خطية تمامًا — هجوم النص المعروف يحل مصفوفة المفتاح بـ n² معادلة باستخدام الحذف الغاوسي mod 26.",
        "26 حرفًا فقط في كل موضع، فالأنماط بين الكتل قد تتسرب.",
        "المصفوفة غير القابلة للعكس (det ≡ 0 أو غير أولي نسبيًا مع 26) لا تصلح، وتوليد المفاتيح المهمل يفشل بصمت.",
        "الحشو بحرف X يكشف طول الرسالة ويترك بصمة.",
      ],
      attacks: [
        { name: "الحل الخطي بالنص المعروف", desc: "n من أزواج الكتل المستقلة خطيًا تعطي M مباشرة بعكس مصفوفة النص الأصلي mod 26.", cost: "فوري بـ n كتل" },
        { name: "تحليل تكرار الأزواج والثلاثيات", desc: "عند n=2 طابق أكثر الأزواج تكرارًا في النص المشفَّر مع أكثرها في النص الأصلي.", cost: "دقائق" },
        { name: "النص المختار", desc: "إدخال المتجهات الأساسية e₁…eₙ يكشف كل عمود من مصفوفة المفتاح واحدًا واحدًا.", cost: "n عمليات تشفير" },
      ],
      verdict:
        "هيل أجمل الشيفرات الكلاسيكية رياضيًا وأكثرها تحذيرًا تعليميًا: الخطية عيب قاتل. وهي تُظهر بالضبط لماذا يجب أن تمزج الشيفرات الحديثة بين الانتشار الخطي والتشويش غير الخطي.",
      lab: {
        inputPlaceholder: "اكتب أحرفًا فقط وسيتم تكتيلها في متجهات…",
        presets: [
          { label: "أزواج", value: "HILL CIPHER BLOCKS" },
          { label: "طول فردي", value: "LINEAR ALGEBRA" },
          { label: "طويل", value: "MATRIX MULTIPLICATION MODULO TWENTY SIX" },
        ],
      },
    },
  },

  /* ============================== 10 · XOR ============================== */
  xor: {
    en: {
      name: "XOR Cipher",
      tagline: "The one-bit operation that modern cryptography is built on.",
      history:
        "The exclusive-or operation entered cryptography through the Vernam cipher (1919) and, when the key is truly random, used once and as long as the message, becomes Shannon's proven-perfect one-time pad. Every modern stream cipher and block cipher mode is, at heart, an XOR of data with a pseudorandom keystream.",
      what: [
        "XOR (⊕) compares two bits and returns 1 only when they differ: 0⊕0=0, 0⊕1=1, 1⊕0=1, 1⊕1=0. Its magic property is that x ⊕ k ⊕ k = x — applying the same key twice cancels it out.",
        "The cipher XORs each byte of the message with the corresponding byte of a repeating key. Because encryption and decryption are the identical operation, the implementation is beautifully symmetric.",
      ],
      how: [
        { title: "Convert to bytes", body: "Encode the message (UTF-8) and the key into byte sequences.", math: "M = [m₀, m₁, …], K = [k₀, k₁, …]" },
        { title: "XOR byte by byte", body: "Combine each message byte with the key byte at the same position modulo the key length.", math: "cᵢ = mᵢ ⊕ kᵢ mod |K|" },
        { title: "Encode the output", body: "Raw XOR bytes are not printable, so represent them as hexadecimal, Base64 or binary.", math: "bytes → hex / base64 / bits" },
        { title: "Decrypt by XORing again", body: "The same operation with the same key restores the original bytes because k ⊕ k = 0.", math: "mᵢ = cᵢ ⊕ kᵢ" },
      ],
      formula: {
        display: "cᵢ = mᵢ ⊕ kᵢ mod |K|\nmᵢ = cᵢ ⊕ kᵢ mod |K|\ntruth table:  0⊕0=0   0⊕1=1   1⊕0=1   1⊕1=0",
        caption: "Bitwise exclusive-or — an involution over the byte space",
        symbols: [
          { sym: "⊕", meaning: "bitwise exclusive OR" },
          { sym: "mᵢ", meaning: "i-th byte of the plaintext" },
          { sym: "kⱼ", meaning: "j-th byte of the repeating key" },
          { sym: "|K|", meaning: "key length in bytes" },
          { sym: "cᵢ", meaning: "i-th byte of the ciphertext" },
        ],
      },
      example: {
        plaintext: "Hi!",
        keyLabel: "Key",
        keyValue: "KEY",
        steps: [
          { title: "Get the bytes", body: "UTF-8 encodes H, i and ! into three bytes.", math: "H=0x48 (72)   i=0x69 (105)   !=0x21 (33)" },
          { title: "Get the key bytes", body: "K, E, Y likewise.", math: "K=0x4B (75)   E=0x45 (69)   Y=0x59 (89)" },
          { title: "XOR the first byte", body: "01001000 ⊕ 01001011 = 00000011.", math: "0x48 ⊕ 0x4B = 0x03" },
          { title: "XOR the second byte", body: "01101001 ⊕ 01000101 = 00101100.", math: "0x69 ⊕ 0x45 = 0x2C" },
          { title: "XOR the third byte", body: "00100001 ⊕ 01011001 = 01111000.", math: "0x21 ⊕ 0x59 = 0x78" },
          { title: "Hexadecimal output", body: "Three bytes rendered as hex, ready to transmit.", math: "03 2C 78" },
        ],
        ciphertext: "03 2c 78",
      },
      strengths: [
        "Blazing fast — a single CPU instruction per byte, fully vectorisable.",
        "Perfectly symmetric: one function encrypts and decrypts.",
        "With a truly random, single-use, full-length key it becomes the one-time pad — the only cipher proven unconditionally secure by Shannon.",
        "The foundation of every stream cipher, of CTR and OFB modes, and of GHASH in AES-GCM.",
      ],
      weaknesses: [
        "A short repeating key is catastrophic: the ciphertext repeats with period |K| and yields to Kasiski-style analysis.",
        "XOR with a known or guessable plaintext reveals the keystream directly (crib dragging).",
        "No integrity: flipping a ciphertext bit flips exactly one plaintext bit, undetected.",
        "Zero-byte key material leaves data unchanged, a classic implementation mistake.",
      ],
      attacks: [
        { name: "Crib dragging", desc: "XOR the ciphertext with a guessed phrase; where the guess is right, readable text slides out at every key offset.", cost: "seconds" },
        { name: "Frequency / chi-squared analysis", desc: "For each candidate key length and each key byte, choose the value that makes the decrypted column look most like English.", cost: "milliseconds" },
        { name: "Two-time pad", desc: "If the same key encrypted two messages, XOR the two ciphertexts together and the key cancels, leaving m₁ ⊕ m₂ which is easily solved.", cost: "fast" },
      ],
      verdict:
        "XOR is not weak or strong on its own — it is a primitive whose security comes entirely from the keystream. Understand XOR and you understand the skeleton of every modern cipher.",
      lab: {
        inputPlaceholder: "Type a message or paste hex/base64 to decrypt…",
        presets: [
          { label: "Greeting", value: "Hi!" },
          { label: "Secret", value: "LAUNCH AT MIDNIGHT" },
          { label: "Unicode", value: "مرحبا بالعالم — XOR handles UTF-8" },
        ],
      },
    },
    ar: {
      name: "شيفرة XOR",
      tagline: "العملية الثنائية الواحدة التي بُني عليها التشفير الحديث.",
      history:
        "دخلت عملية «أو الحصري» إلى التشفير عبر شيفرة فيرنام عام 1919، وعندما يكون المفتاح عشوائيًا حقًا ويُستخدم مرة واحدة ويكون بطول الرسالة تصبح «لوحة المرة الواحدة» التي أثبت شانون أنها مثالية تمامًا. وكل شيفرة تدفق حديثة وكل نمط تشغيل كتلي هو في جوهره XOR بين البيانات وتيار مفاتيح شبه عشوائي.",
      what: [
        "عملية XOR (⊕) تقارن بتّين وتُعيد 1 فقط إذا اختلفا: 0⊕0=0 و 0⊕1=1 و 1⊕0=1 و 1⊕1=0. وخاصيتها السحرية أن x ⊕ k ⊕ k = x — أي أن تطبيق نفس المفتاح مرتين يلغيه.",
        "تقوم الشيفرة بعمل XOR بين كل بايت من الرسالة والبايت المقابل من مفتاح متكرر. ولأن التشفير وفك التشفير نفس العملية تمامًا، يصبح التنفيذ متماثلًا بجمال نادر.",
      ],
      how: [
        { title: "حوّل إلى بايتات", body: "رمّز الرسالة (UTF-8) والمفتاح إلى سلاسل بايتات.", math: "M = [m₀, m₁, …], K = [k₀, k₁, …]" },
        { title: "نفّذ XOR بايت ببايت", body: "اجمع كل بايت من الرسالة مع بايت المفتاح في نفس الموضع modulo طول المفتاح.", math: "cᵢ = mᵢ ⊕ kᵢ mod |K|" },
        { title: "رمّز الناتج", body: "بايتات XOR الخام غير قابلة للطباعة، لذا نعرضها سداسي عشر أو Base64 أو ثنائي.", math: "bytes → hex / base64 / bits" },
        { title: "فكّ التشفير بنفس العملية", body: "نفس العملية بنفس المفتاح تعيد البايتات الأصلية لأن k ⊕ k = 0.", math: "mᵢ = cᵢ ⊕ kᵢ" },
      ],
      formula: {
        display: "cᵢ = mᵢ ⊕ kᵢ mod |K|\nmᵢ = cᵢ ⊕ kᵢ mod |K|\ntruth table:  0⊕0=0   0⊕1=1   1⊕0=1   1⊕1=0",
        caption: "أو حصري بتّي — دالة عكسية لذاتها على فضاء البايتات",
        symbols: [
          { sym: "⊕", meaning: "عملية أو الحصري بت ببت" },
          { sym: "mᵢ", meaning: "البايت رقم i من النص الأصلي" },
          { sym: "kⱼ", meaning: "البايت رقم j من المفتاح المتكرر" },
          { sym: "|K|", meaning: "طول المفتاح بالبايت" },
          { sym: "cᵢ", meaning: "البايت رقم i من النص المشفَّر" },
        ],
      },
      example: {
        plaintext: "Hi!",
        keyLabel: "المفتاح",
        keyValue: "KEY",
        steps: [
          { title: "احصل على البايتات", body: "ترميز UTF-8 يحوّل H و i و ! إلى ثلاثة بايتات.", math: "H=0x48 (72)   i=0x69 (105)   !=0x21 (33)" },
          { title: "احصل على بايتات المفتاح", body: "وكذلك K و E و Y.", math: "K=0x4B (75)   E=0x45 (69)   Y=0x59 (89)" },
          { title: "نفّذ XOR على البايت الأول", body: "01001000 ⊕ 01001011 = 00000011.", math: "0x48 ⊕ 0x4B = 0x03" },
          { title: "البايت الثاني", body: "01101001 ⊕ 01000101 = 00101100.", math: "0x69 ⊕ 0x45 = 0x2C" },
          { title: "البايت الثالث", body: "00100001 ⊕ 01011001 = 01111000.", math: "0x21 ⊕ 0x59 = 0x78" },
          { title: "الناتج السداسي عشر", body: "ثلاثة بايتات بصيغة hex جاهزة للإرسال.", math: "03 2C 78" },
        ],
        ciphertext: "03 2c 78",
      },
      strengths: [
        "سريعة للغاية — تعليمة معالج واحدة لكل بايت، وقابلة للتوازي بالكامل.",
        "متماثلة تمامًا: دالة واحدة تُشفّر وتفكّ التشفير.",
        "مع مفتاح عشوائي حقيقي يُستخدم مرة واحدة بطول الرسالة تصبح «لوحة المرة الواحدة» — الشيفرة الوحيدة المثبت أنها آمنة بشكل غير مشروط.",
        "أساس كل شيفرات التدفق وأنماط CTR وOFB ودالة GHASH في AES-GCM.",
      ],
      weaknesses: [
        "المفتاح القصير المتكرر كارثي: يتكرر النص المشفَّر بنفس الدورة ويخضع لتحليل كاسيسكي.",
        "عمل XOR مع نص معروف أو قابل للتخمين يكشف تيار المفتاح مباشرة (Crib Dragging).",
        "لا سلامة للبيانات: قلب بت في النص المشفَّر يقلب بتًا واحدًا في الأصل دون أن يُكتشف.",
        "بايتات المفتاح الصفرية تترك البيانات دون تغيير، وهو خطأ برمجي شائع.",
      ],
      attacks: [
        { name: "سحب القريب (Crib Dragging)", desc: "نفّذ XOR بين النص المشفَّر وعبارة مُخمَّنة؛ حيث تصح التخمينه ينزلق نص مقروء عند كل إزاحة مفتاح.", cost: "ثوانٍ" },
        { name: "تحليل التكرار وكاي تربيع", desc: "لكل طول مفتاح مرشح وكل بايت مفتاح اختر القيمة التي تجعل العمود المفكوك أقرب ما يكون للإنجليزية.", cost: "ملي ثوانٍ" },
        { name: "لوحة المرتين (Two-time pad)", desc: "إذا شُفّرت رسالتان بنفس المفتاح، فعمل XOR بين النصين المشفرين يلغي المفتاح ويبقى m₁ ⊕ m₂ وهو سهل الحل.", cost: "سريع" },
      ],
      verdict:
        "XOR ليست ضعيفة ولا قوية بذاتها — إنها لبنة أولية تستمد أمنها كاملًا من تيار المفتاح. افهم XOR تفهم هيكل كل شيفرة حديثة.",
      lab: {
        inputPlaceholder: "اكتب رسالة أو الصق hex/base64 لفك التشفير…",
        presets: [
          { label: "تحية", value: "Hi!" },
          { label: "سرّي", value: "LAUNCH AT MIDNIGHT" },
          { label: "يونيكود", value: "مرحبا بالعالم — XOR handles UTF-8" },
        ],
      },
    },
  },

  /* ============================ 11 · SHA-256 ============================ */
  sha256: {
    en: {
      name: "SHA-256 Hashing",
      tagline: "A one-way fingerprint — 256 bits you can compute but never reverse.",
      history:
        "Designed by the NSA and published by NIST in 2001 as part of the SHA-2 family (FIPS 180-4). It secures TLS certificates, password storage, Git commit identities, Bitcoin mining and blockchain addresses. Its predecessor SHA-1 was broken with a practical collision in 2017; SHA-256 remains unbroken.",
      what: [
        "SHA-256 is not a cipher — it is a cryptographic hash function. There is no key and no decryption. It maps a message of any length to a fixed 256-bit digest that behaves like a fingerprint: the same input always gives the same output, and any change to the input changes roughly half of the output bits.",
        "Three properties make it cryptographic: pre-image resistance (you cannot go backwards from hash to message), second pre-image resistance (you cannot find another message with the same hash), and collision resistance (you cannot find any two messages that share a hash).",
      ],
      how: [
        { title: "Pad the message", body: "Append a single 1 bit, then zeros, then the original bit length as a 64-bit big-endian integer, so that the total length is a multiple of 512 bits.", math: "L ‖ 1 ‖ 0…0 ‖ len₆₄ ≡ 0 (mod 512)" },
        { title: "Split into 512-bit blocks", body: "Each block becomes sixteen 32-bit words W₀…W₁₅.", math: "blocks = ⌈(L+65)/512⌉" },
        { title: "Expand the message schedule", body: "Stretch those 16 words into 64 using rotations and XORs.", math: "Wₜ = Wₜ₋₁₆ + σ₀(Wₜ₋₁₅) + Wₜ₋₇ + σ₁(Wₜ₋₂)" },
        { title: "Run 64 compression rounds", body: "Eight 32-bit working variables a…h are mixed with the schedule and 64 fixed constants Kₜ using Ch, Maj, Σ₀ and Σ₁.", math: "T₁ = h + Σ₁(e) + Ch(e,f,g) + Kₜ + Wₜ\nT₂ = Σ₀(a) + Maj(a,b,c)" },
        { title: "Feed forward", body: "Add the compressed block into the running state H, then repeat for the next block. After the last block, H is the digest.", math: "H = H + [a…h] mod 2³²" },
      ],
      formula: {
        display: "SHA256 : {0,1}* → {0,1}²⁵⁶\nE(x) = (x + k) mod 26   ← reversible\nh = H(m)               ← NOT reversible\nΣ₀(a) = ROTR²(a) ⊕ ROTR¹³(a) ⊕ ROTR²²(a)\nCh(e,f,g) = (e ∧ f) ⊕ (¬e ∧ g)",
        caption: "A compression function iterated over 512-bit blocks",
        symbols: [
          { sym: "m", meaning: "the input message of arbitrary length" },
          { sym: "h", meaning: "the 256-bit (64 hex character) digest" },
          { sym: "Wₜ", meaning: "the 64-word message schedule" },
          { sym: "Kₜ", meaning: "64 fixed round constants from cube roots of primes" },
          { sym: "ROTRⁿ", meaning: "circular right rotation by n bits" },
          { sym: "Ch / Maj", meaning: "'choose' and 'majority' non-linear bit functions" },
        ],
      },
      example: {
        plaintext: "abc",
        keyLabel: "Key",
        keyValue: "none (keyless hash)",
        steps: [
          { title: "Measure the input", body: "'abc' is 3 bytes = 24 bits.", math: "L = 24" },
          { title: "Pad to 512 bits", body: "Append 0x80, then 55 zero bytes, then the 8-byte length field 0x0000000000000018.", math: "61 62 63 80 00…00 00 00 00 00 00 00 00 18" },
          { title: "Load the first words", body: "The block starts with the ASCII of 'abc' packed big-endian.", math: "W₀ = 0x61626380, W₁…W₁₄ = 0, W₁₅ = 0x00000018" },
          { title: "Initialise the state", body: "Eight 32-bit constants taken from the fractional parts of the square roots of the first primes.", math: "H₀ = 6a09e667 … H₇ = 5be0cd19" },
          { title: "Compress 64 rounds", body: "One block means exactly 64 rounds of mixing, then the feed-forward addition.", math: "H ← H + compression(block)" },
          { title: "Read the digest", body: "The famous SHA-256 of 'abc' — matching the FIPS test vector proves the implementation is correct.", math: "ba7816bf 8f01cfea 414140de 5dae2223\nb00361a3 96177a9c b410ff61 f20015ad" },
        ],
        ciphertext: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
      },
      strengths: [
        "Fixed-size output for any input — the definition of a compression function.",
        "Avalanche effect: changing one bit of input flips about 128 of the 256 output bits.",
        "Collision resistant — no practical collision has ever been found, unlike MD5 and SHA-1.",
        "Ubiquitous and hardware-accelerated: TLS, Git, Bitcoin, password hashing (PBKDF2/bcrypt use it as a core).",
      ],
      weaknesses: [
        "It is not encryption — there is no way to decrypt a hash, by design.",
        "Fast hashing is a liability for passwords: billions of guesses per second on GPUs, so salts and slow KDFs are mandatory.",
        "No built-in integrity key — use HMAC-SHA256 if you need authentication.",
        "Theoretical length-extension attacks affect raw Merkle–Damgård usage.",
      ],
      attacks: [
        { name: "Brute force / rainbow tables", desc: "Hash every candidate until one matches. Effective only against weak, short or unsalted inputs.", cost: "2²⁵⁶ for random inputs — infeasible" },
        { name: "Collision search (birthday)", desc: "Find any two inputs with the same digest. Expected work is 2¹²⁸ — still far beyond reach.", cost: "2¹²⁸ operations" },
        { name: "Length extension", desc: "Given H(secret ‖ msg), compute H(secret ‖ msg ‖ padding ‖ extra) without knowing the secret.", cost: "trivial — hence HMAC" },
      ],
      verdict:
        "SHA-256 is the workhorse of modern trust. It cannot protect confidentiality, but it provides the integrity, identity and proof-of-work that the entire internet runs on.",
      lab: {
        inputPlaceholder: "Type anything — even one changed character rewrites the whole digest…",
        presets: [
          { label: "FIPS vector", value: "abc" },
          { label: "Empty-ish", value: " " },
          { label: "Sentence", value: "The quick brown fox jumps over the lazy dog" },
        ],
      },
    },
    ar: {
      name: "تجزئة SHA-256",
      tagline: "بصمة أحادية الاتجاه — 256 بت تحسبها ولا تعكسها أبدًا.",
      history:
        "صممتها وكالة الأمن القومي ونشرها معهد NIST عام 2001 ضمن عائلة SHA-2 (المعيار FIPS 180-4). وهي تؤمّن شهادات TLS وتخزين كلمات المرور وهوية التزامات في Git وتعدين البيتكوين وعناوين البلوكتشين. وقد كُسرت سلفتها SHA-1 بتصادم عملي عام 2017، بينما ما زالت SHA-256 صامدة.",
      what: [
        "SHA-256 ليست شيفرة — إنها دالة تجزئة تشفيرية. لا يوجد مفتاح ولا يوجد فك تشفير. فهي تحوّل رسالة من أي طول إلى ملخص ثابت من 256 بت يتصرف كبصمة: نفس المدخل يعطي نفس الناتج دائمًا، وأي تغيير في المدخل يغيّر نحو نصف بتات الناتج.",
        "وثلاث خصائص تجعلها تشفيرية: مقاومة الصورة الأولى (لا يمكن الرجوع من الملخص إلى الرسالة)، ومقاومة الصورة الثانية (لا يمكن إيجاد رسالة أخرى بنفس الملخص)، ومقاومة التصادم (لا يمكن إيجاد أي رسالتين لهما نفس الملخص).",
      ],
      how: [
        { title: "احشُ الرسالة", body: "أضف بتًا واحدًا قيمته 1 ثم أصفارًا ثم طول الرسالة الأصلي كعدد 64 بت بالترتيب الكبير، بحيث يكون الطول الكلي مضاعفًا لـ512 بت.", math: "L ‖ 1 ‖ 0…0 ‖ len₆₄ ≡ 0 (mod 512)" },
        { title: "قسّم إلى كتل 512 بت", body: "كل كتلة تصبح ست عشرة كلمة من 32 بت W₀…W₁₅.", math: "blocks = ⌈(L+65)/512⌉" },
        { title: "وسّع جدول الرسالة", body: "مُدّ هذه الكلمات الست عشرة إلى 64 كلمة باستخدام التدوير و XOR.", math: "Wₜ = Wₜ₋₁₆ + σ₀(Wₜ₋₁₅) + Wₜ₋₇ + σ₁(Wₜ₋₂)" },
        { title: "نفّذ 64 جولة ضغط", body: "ثمانية متغيرات عمل من 32 بت a…h تُمزج مع الجدول و64 ثابتًا Kₜ باستخدام Ch و Maj و Σ₀ و Σ₁.", math: "T₁ = h + Σ₁(e) + Ch(e,f,g) + Kₜ + Wₜ\nT₂ = Σ₀(a) + Maj(a,b,c)" },
        { title: "التغذية الأمامية", body: "أضف الكتلة المضغوطة إلى الحالة الجارية H ثم كرّر للكتلة التالية. وبعد آخر كتلة تكون H هي الملخص.", math: "H = H + [a…h] mod 2³²" },
      ],
      formula: {
        display: "SHA256 : {0,1}* → {0,1}²⁵⁶\nE(x) = (x + k) mod 26   ← reversible\nh = H(m)               ← NOT reversible\nΣ₀(a) = ROTR²(a) ⊕ ROTR¹³(a) ⊕ ROTR²²(a)\nCh(e,f,g) = (e ∧ f) ⊕ (¬e ∧ g)",
        caption: "دالة ضغط تُكرَّر على كتل من 512 بت",
        symbols: [
          { sym: "m", meaning: "رسالة المدخل بأي طول" },
          { sym: "h", meaning: "الملخص النهائي 256 بت (64 رمزًا سداسي عشر)" },
          { sym: "Wₜ", meaning: "جدول الرسالة المكوّن من 64 كلمة" },
          { sym: "Kₜ", meaning: "64 ثابت جولات مأخوذة من الجذور التكعيبية للأعداد الأولية" },
          { sym: "ROTRⁿ", meaning: "تدوير دائري لليمين بمقدار n بت" },
          { sym: "Ch / Maj", meaning: "دالتا «الاختيار» و«الأغلبية» غير الخطيتين" },
        ],
      },
      example: {
        plaintext: "abc",
        keyLabel: "المفتاح",
        keyValue: "لا يوجد (تجزئة بلا مفتاح)",
        steps: [
          { title: "قس المدخل", body: "الكلمة 'abc' طولها 3 بايت = 24 بت.", math: "L = 24" },
          { title: "احشُ حتى 512 بت", body: "أضف 0x80 ثم 55 بايت صفر ثم حقل الطول 0x0000000000000018.", math: "61 62 63 80 00…00 00 00 00 00 00 00 00 18" },
          { title: "حمّل الكلمات الأولى", body: "تبدأ الكتلة برموز 'abc' في ترميز big-endian.", math: "W₀ = 0x61626380, W₁…W₁₄ = 0, W₁₅ = 0x00000018" },
          { title: "هيّئ الحالة الأولية", body: "ثمانية ثوابت من 32 بت مأخوذة من الأجزاء الكسرية للجذور التربيعية للأعداد الأولية الأولى.", math: "H₀ = 6a09e667 … H₇ = 5be0cd19" },
          { title: "اضغط 64 جولة", body: "كتلة واحدة تعني 64 جولة خلط بالضبط ثم عملية الجمع الأمامي.", math: "H ← H + compression(block)" },
          { title: "اقرأ الملخص", body: "الملخص الشهير لكلمة 'abc' — ومطابقته لمتجه اختبار FIPS تثبت صحة التنفيذ.", math: "ba7816bf 8f01cfea 414140de 5dae2223\nb00361a3 96177a9c b410ff61 f20015ad" },
        ],
        ciphertext: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
      },
      strengths: [
        "ناتج بحجم ثابت لأي مدخل — وهذا هو تعريف دالة الضغط.",
        "تأثير الانهيار الجليدي: تغيير بت واحد في المدخل يقلب نحو 128 من 256 بت في الناتج.",
        "مقاومة للتصادم — لم يُعثر على أي تصادم عملي لها، بخلاف MD5 و SHA-1.",
        "منتشرة ومسرّعة عتاديًا: TLS وGit والبيتكوين وتجزئة كلمات المرور (PBKDF2 وbcrypt تستخدمها نواةً).",
      ],
      weaknesses: [
        "ليست تشفيرًا — لا توجد أي طريقة لفك التجزئة، وهذا مقصود بالتصميم.",
        "سرعة التجزئة خطر على كلمات المرور: مليارات التخمينات في الثانية على GPUs، لذا التمليح ودوال الاشتقاق البطيئة إلزامية.",
        "لا يوجد مفتاح سلامة مدمج — استخدم HMAC-SHA256 إذا احتجت توثيقًا.",
        "هجمات امتداد الطول النظرية تصيب استخدام Merkle–Damgård الخام.",
      ],
      attacks: [
        { name: "البحث الشامل وجداول قوس قزح", desc: "جزّئ كل مرشح حتى تجد مطابقًا. ولا ينجح إلا مع المدخلات الضعيفة أو القصيرة أو غير المملحة.", cost: "2²⁵⁶ للمدخلات العشوائية — مستحيل" },
        { name: "بحث التصادم (عيد الميلاد)", desc: "إيجاد أي مدخلين لهما نفس الملخص. الجهد المتوقع 2¹²⁨ — وما زال بعيدًا جدًا.", cost: "2¹²⁸ عملية" },
        { name: "امتداد الطول", desc: "بمعرفة H(secret ‖ msg) يمكن حساب H(secret ‖ msg ‖ padding ‖ extra) دون معرفة السر.", cost: "تافه — ولهذا وُجد HMAC" },
      ],
      verdict:
        "SHA-256 هي عمود الثقة الحديث. لا تحمي السرية، لكنها توفر السلامة والهوية وإثبات العمل الذي يقوم عليه الإنترنت كله.",
      lab: {
        inputPlaceholder: "اكتب أي شيء — حتى تغيير حرف واحد يعيد كتابة الملخص كله…",
        presets: [
          { label: "متجه FIPS", value: "abc" },
          { label: "فراغ تقريبًا", value: " " },
          { label: "جملة", value: "The quick brown fox jumps over the lazy dog" },
        ],
      },
    },
  },
};
