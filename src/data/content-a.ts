import type { AlgorithmId } from "../lib/ciphers";
import type { AlgoContent, Localized } from "./types";

export const contentA: Partial<Record<AlgorithmId, Localized<AlgoContent>>> = {
  /* ============================= 1 · CAESAR ============================= */
  caesar: {
    en: {
      name: "Caesar Cipher",
      tagline: "The shift substitution — Rome's first state secret.",
      history:
        "Around 100 BC Julius Caesar corresponded with his generals using a fixed three-letter shift. Suetonius records that if a message was confidential, Caesar wrote it in cipher so that nobody could read it without knowing the shift.",
      what: [
        "The Caesar cipher is the simplest substitution cipher there is: every letter of the message is replaced by the letter sitting a fixed number of positions later in the alphabet. That fixed number is the key, and we call it the shift.",
        "Because the shift never changes during the message, the shape of the text survives completely — spaces, word lengths and punctuation stay exactly where they were. Only the identity of each letter changes. That is precisely what makes the cipher trivial to read once you know the key, and trivial to break if you don't.",
      ],
      how: [
        {
          title: "Number the alphabet",
          body: "Give every letter an index: A = 0, B = 1, … Z = 25. Cryptography always works with numbers first and letters second, so this conversion is step one of nearly every classical cipher.",
          math: "A=0  B=1  C=2 … Z=25",
        },
        {
          title: "Add the shift",
          body: "Add the key k to each index. When the sum passes 25 you wrap around to the start of the alphabet — that wrap-around is the modulo operation, the heartbeat of cryptography.",
          math: "y = (x + k) mod 26",
        },
        {
          title: "Convert back to a letter",
          body: "Translate the new index into its letter. Anything that is not a letter (spaces, digits, punctuation) passes through untouched, and lowercase stays lowercase.",
        },
        {
          title: "Decrypt by subtracting",
          body: "Decryption is the same walk in reverse: subtract the shift instead of adding it. Whoever holds the key can always walk back; whoever doesn't has only 25 guesses to try.",
          math: "x = (y − k) mod 26",
        },
      ],
      formula: {
        display: "E(x) = (x + k) mod 26\nD(y) = (y − k) mod 26",
        caption: "Shift substitution over the 26-letter Latin alphabet",
        symbols: [
          { sym: "x", meaning: "index of the plaintext letter (A=0 … Z=25)" },
          { sym: "y", meaning: "index of the produced ciphertext letter" },
          { sym: "k", meaning: "the shift key, an integer from 1 to 25" },
          { sym: "mod 26", meaning: "wrap the result back into the 0–25 range" },
          { sym: "E / D", meaning: "encryption and decryption functions" },
        ],
      },
      example: {
        plaintext: "MEET AT DAWN",
        keyLabel: "Shift",
        keyValue: "k = 3",
        steps: [
          { title: "Write the plaintext as indices", body: "Replace each letter by its position number.", math: "M=12  E=4  E=4  T=19" },
          { title: "Add the key to every index", body: "The same key is applied to every letter — that is what makes it monoalphabetic.", math: "12+3=15   4+3=7   4+3=7   19+3=22" },
          { title: "Wrap anything beyond 25", body: "If a sum is greater than 25, subtract 26 to loop back to the start of the alphabet.", math: "(24+3) mod 26 = 27 − 26 = 1 → B" },
          { title: "Map indices back to letters", body: "Read the resulting numbers as letters again.", math: "15=P  7=H  7=H  22=W   →   PHHW" },
          { title: "Non-letters are preserved", body: "Spaces keep their place, so the word skeleton AT / DAWN is still visible in the ciphertext.", math: "PHHW DW GDZQ" },
        ],
        ciphertext: "PHHW DW GDZQ",
      },
      strengths: [
        "Extremely simple — no tables, no tools, doable in your head.",
        "Historically decisive: it protected Roman military logistics for decades.",
        "The clearest possible introduction to the two ideas behind all ciphers: substitution and modular arithmetic.",
        "Linear time — one addition per character, O(n).",
      ],
      weaknesses: [
        "Only 25 possible keys. A child can enumerate all of them in a minute.",
        "Letter frequencies survive the shift untouched, so frequency analysis reveals the key immediately.",
        "Spaces and word lengths are preserved, leaking the skeleton of the message.",
        "One shift for the whole message means repeated letters map to repeated letters.",
      ],
      attacks: [
        {
          name: "Brute force / exhaustive search",
          desc: "Decrypt with all 25 shifts and read the 25 results. Exactly one will be meaningful language.",
          cost: "25 trials",
        },
        {
          name: "Frequency analysis",
          desc: "Count the letters of the ciphertext, compare the histogram with the known profile of the language (E ≈ 12.7% in English). The distance between the two peaks is the key.",
          cost: "a few minutes",
        },
        {
          name: "Known-plaintext (crib)",
          desc: "Guess one likely word — a name, a date, a signature — and the shift falls out instantly.",
          cost: "instant",
        },
      ],
      verdict:
        "Educationally priceless, cryptographically worthless. Caesar is the 'Hello World' of cryptography: study it deeply, then never trust it with anything real.",
      lab: {
        inputPlaceholder: "Type the message you want to shift…",
        presets: [
          { label: "Roman", value: "MEET ME AT THE SENATE" },
          { label: "Military", value: "ATTACK AT DAWN" },
          { label: "Pangram", value: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG" },
        ],
      },
    },
    ar: {
      name: "شيفرة قيصر",
      tagline: "الإزاحة الاستبدالية — أول سرّ دولة في تاريخ روما.",
      history:
        "حوالي عام 100 قبل الميلاد كان يوليوس قيصر يراسل قادته العسكريين بإزاحة ثابتة مقدارها ثلاثة أحرف. ويذكر المؤرخ سويتونيوس أن قيصر كان يكتب الرسائل السرية بطريقة لا يفهمها أحد إلا من يعرف مقدار الإزاحة.",
      what: [
        "شيفرة قيصر هي أبسط شيفرة استبدال على الإطلاق: كل حرف في الرسالة يُستبدل بالحرف الذي يليه بعدد ثابت من المواقع داخل الأبجدية. هذا العدد الثابت هو المفتاح، ونسميه الإزاحة.",
        "ولأن الإزاحة لا تتغير أبدًا أثناء الرسالة، فإن شكل النص يبقى كما هو تمامًا: المسافات وأطوال الكلمات وعلامات الترقيم تظل في مكانها، ولا يتغير سوى هوية كل حرف. وهذا بالضبط ما يجعل الشيفرة سهلة القراءة لمن يعرف المفتاح، وسهلة الكسر لمن لا يعرفه.",
      ],
      how: [
        {
          title: "رقّم الأبجدية",
          body: "أعطِ كل حرف رقمًا: A = 0، B = 1، … حتى Z = 25. علم التشفير يعمل بالأرقام أولًا ثم يحوّلها إلى أحرف، لذا فهذه الخطوة هي بداية كل شيفرة كلاسيكية تقريبًا.",
          math: "A=0  B=1  C=2 … Z=25",
        },
        {
          title: "أضف الإزاحة",
          body: "أضف المفتاح k إلى رقم كل حرف. وإذا تجاوز المجموع 25 فإننا نعود إلى بداية الأبجدية — وهذه العودة هي عملية باقي القسمة (mod)، وهي قلب التشفير النابض.",
          math: "y = (x + k) mod 26",
        },
        {
          title: "حوّل الرقم إلى حرف",
          body: "أعد ترجمة الرقم الجديد إلى حرفه المقابل. أما ما ليس حرفًا (مسافات وأرقام وعلامات ترقيم) فيمرّ كما هو دون تغيير.",
        },
        {
          title: "فكّ التشفير بالطرح",
          body: "فك التشفير هو نفس المشي في الاتجاه المعاكس: نطرح الإزاحة بدل أن نضيفها. من يملك المفتاح يعود دائمًا، ومن لا يملكه أمامه 25 محاولة فقط.",
          math: "x = (y − k) mod 26",
        },
      ],
      formula: {
        display: "E(x) = (x + k) mod 26\nD(y) = (y − k) mod 26",
        caption: "استبدال بالإزاحة على أبجدية لاتينية من 26 حرفًا",
        symbols: [
          { sym: "x", meaning: "رقم حرف النص الأصلي (A=0 … Z=25)" },
          { sym: "y", meaning: "رقم حرف النص المشفَّر الناتج" },
          { sym: "k", meaning: "مفتاح الإزاحة، عدد صحيح من 1 إلى 25" },
          { sym: "mod 26", meaning: "إعادة الناتج إلى المدى من 0 إلى 25" },
          { sym: "E / D", meaning: "دالتا التشفير وفك التشفير" },
        ],
      },
      example: {
        plaintext: "MEET AT DAWN",
        keyLabel: "الإزاحة",
        keyValue: "k = 3",
        steps: [
          { title: "اكتب النص الأصلي كأرقام", body: "استبدل كل حرف برقم موقعه في الأبجدية.", math: "M=12  E=4  E=4  T=19" },
          { title: "أضف المفتاح إلى كل رقم", body: "نفس المفتاح يُطبَّق على كل الحروف، ولهذا نسميها شيفرة أحادية الأبجدية.", math: "12+3=15   4+3=7   4+3=7   19+3=22" },
          { title: "لفّ ما يتجاوز 25", body: "إذا كان المجموع أكبر من 25 نطرح 26 للعودة إلى بداية الأبجدية.", math: "(24+3) mod 26 = 27 − 26 = 1 → B" },
          { title: "أعد الأرقام إلى أحرف", body: "اقرأ الأرقام الناتجة كأحرف مرة أخرى.", math: "15=P  7=H  7=H  22=W   →   PHHW" },
          { title: "غير الحروف يبقى كما هو", body: "المسافات تحتفظ بمكانها، لذلك يظل هيكل الكلمات ظاهرًا في النص المشفَّر.", math: "PHHW DW GDZQ" },
        ],
        ciphertext: "PHHW DW GDZQ",
      },
      strengths: [
        "بسيطة للغاية — لا جداول ولا أدوات، ويمكن تنفيذها ذهنيًا.",
        "أثرها التاريخي حاسم: حمّت الاتصالات العسكرية الرومانية لعقود.",
        "أوضح مدخل لفكرتين تقوم عليهما كل الشيفرات: الاستبدال والحساب النمطي.",
        "سريعة جدًا — عملية جمع واحدة لكل حرف، أي O(n).",
      ],
      weaknesses: [
        "25 مفتاحًا ممكنًا فقط، ويمكن تعدادها كلها في دقيقة واحدة.",
        "تكرارات الحروف لا تتأثر بالإزاحة، لذا يكشف تحليل التكرار المفتاح فورًا.",
        "المسافات وأطوال الكلمات محفوظة، فتسرّب هيكل الرسالة.",
        "إزاحة واحدة للرسالة كلها تعني أن الحرف المتكرر ينتج عنه حرف متكرر.",
      ],
      attacks: [
        { name: "الهجوم الشامل (Brute Force)", desc: "جرّب فك التشفير بكل الإزاحات الـ25 واقرأ النتائج؛ واحدة فقط ستكون نصًا مفهومًا.", cost: "25 محاولة" },
        { name: "تحليل التكرار", desc: "احسب تكرار الحروف في النص المشفَّر وقارنه بالمنحنى المعروف للغة (حرف E ≈ 12.7% في الإنجليزية). المسافة بين القمتين هي المفتاح.", cost: "دقائق" },
        { name: "هجوم النص المعروف", desc: "خمّن كلمة متوقعة — اسم أو تاريخ أو توقيع — فتظهر الإزاحة مباشرة.", cost: "فوري" },
      ],
      verdict:
        "قيمتها التعليمية لا تُقدَّر بثمن، وقيمتها الأمنية صفر. شيفرة قيصر هي «أهلًا بالعالم» في علم التشفير: تعلّمها بعمق ثم لا تأتمنها على شيء حقيقي.",
      lab: {
        inputPlaceholder: "اكتب الرسالة التي تريد إزاحتها…",
        presets: [
          { label: "روماني", value: "MEET ME AT THE SENATE" },
          { label: "عسكري", value: "ATTACK AT DAWN" },
          { label: "نص شامل", value: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG" },
        ],
      },
    },
  },

  /* ============================= 2 · ATBASH ============================= */
  atbash: {
    en: {
      name: "Atbash Cipher",
      tagline: "Mirror the alphabet — the key is built into the language itself.",
      history:
        "Atbash is a Hebrew substitution cipher used by scribes around 500 BC. It appears in the Bible itself: Jeremiah 25:26 and 51:41 write 'Sheshach', which is Atbash for 'Babel'. The name comes from the first and last letter pairs it swaps: Aleph↔Tav, Beth↔Shin.",
      what: [
        "Atbash reflects the alphabet around its centre: the first letter becomes the last, the second becomes the second-to-last, and so on. A↔Z, B↔Y, C↔X. There is no key to choose, because the mapping is fixed by the alphabet itself.",
        "This makes Atbash a special case of the affine cipher with a = 25 and b = 25, and also a special case of a substitution cipher with a single, publicly known rule. Its elegance is that it is its own inverse: encrypting twice returns the original text.",
      ],
      how: [
        { title: "Write the two alphabets", body: "One normal, one reversed, directly beneath each other. That pair of rows is the whole cipher table.", math: "A B C … X Y Z\nZ Y X … C B A" },
        { title: "Look each letter up", body: "For every plaintext letter, find it in the top row and copy the letter directly below it.", math: "y = 25 − x" },
        { title: "Notice the symmetry", body: "Because the mapping is a perfect mirror, decryption uses the exact same table. Apply Atbash twice and you are back where you started.", math: "25 − (25 − x) = x" },
      ],
      formula: {
        display: "E(x) = (25 − x) mod 26\nD(y) = (25 − y) mod 26",
        caption: "A keyless involution — encryption and decryption are identical",
        symbols: [
          { sym: "x", meaning: "index of the plaintext letter (A=0 … Z=25)" },
          { sym: "25 − x", meaning: "distance from the end of the alphabet" },
          { sym: "E = D", meaning: "the function is its own inverse (an involution)" },
        ],
      },
      example: {
        plaintext: "CRYPTO",
        keyLabel: "Key",
        keyValue: "none (fixed mirror)",
        steps: [
          { title: "Index each letter", body: "Convert CRYPTO into numbers.", math: "C=2  R=17  Y=24  P=15  T=19  O=14" },
          { title: "Subtract from 25", body: "Each letter's mirror is its distance from Z.", math: "25−2=23  25−17=8  25−24=1  25−15=10  25−19=6  25−14=11" },
          { title: "Read the mirrored letters", body: "Convert the results back.", math: "23=X  8=I  1=B  10=K  6=G  11=L" },
          { title: "Verify by re-applying", body: "Run Atbash on XIBKGL and CRYPTO returns — proof of the involution.", math: "Atbash(XIBKGL) = CRYPTO" },
        ],
        ciphertext: "XIBKGL",
      },
      strengths: [
        "Zero key management — nothing to remember, nothing to leak.",
        "Its own inverse, so one piece of code encrypts and decrypts.",
        "Historically genuine: attested in biblical Hebrew manuscripts.",
        "A perfect, instantly graspable demonstration of an involution and of the affine family.",
      ],
      weaknesses: [
        "There is literally one mapping — an attacker does not even need to search a keyspace.",
        "Frequency analysis works perfectly, and the frequency table is simply reversed.",
        "Recognisable at a glance to anyone who knows it; often solved in seconds.",
        "No key means no confidentiality at all against a literate adversary.",
      ],
      attacks: [
        { name: "Recognition", desc: "Spot the reversed frequency profile: the most common ciphertext letter corresponds to the most common plaintext letter read backwards.", cost: "instant" },
        { name: "Frequency analysis", desc: "Map the ciphertext histogram onto the reversed language histogram; the whole text collapses at once.", cost: "seconds" },
        { name: "Known plaintext", desc: "One guessed word confirms the mirror and the rest follows mechanically.", cost: "instant" },
      ],
      verdict:
        "Atbash is a beautiful artefact of scribal tradition and a superb teaching tool for involutions — but with a keyspace of exactly one, it offers no security whatsoever.",
      lab: {
        inputPlaceholder: "Type text and watch the alphabet fold in on itself…",
        presets: [
          { label: "Hebrew root", value: "ALEPH TAV" },
          { label: "Mirror", value: "CRYPTOGRAPHY IS THE ART OF SECRETS" },
          { label: "Involution", value: "APPLY TWICE GET ORIGINAL" },
        ],
      },
    },
    ar: {
      name: "شيفرة أتباش",
      tagline: "اعكس الأبجدية — المفتاح مدمج في بنية اللغة نفسها.",
      history:
        "أتباش شيفرة عبرانية قديمة استخدمها النسّاخ حوالي 500 قبل الميلاد، وذُكرت في الكتاب المقدس نفسه: ففي إرميا 25:26 و51:41 كُتبت «شيشك» وهي أتباش لكلمة «بابل». واسمها مأخوذ من أول وآخر زوجين يبدّلهما: ألف↔تاف، بيت↔شين.",
      what: [
        "أتباش تعكس الأبجدية حول مركزها: الحرف الأول يصبح الأخير، والثاني يصبح قبل الأخير، وهكذا. A↔Z و B↔Y و C↔X. ولا يوجد مفتاح تختاره، لأن القاعدة ثابتة بفعل الأبجدية نفسها.",
        "وهذا يجعل أتباش حالة خاصة من الشيفرة التآلفية عندما a = 25 و b = 25، وهي كذلك دالة عكسية لذاتها: إذا طبّقتها مرتين يعود النص الأصلي كما كان.",
      ],
      how: [
        { title: "اكتب الأبجديتين", body: "واحدة عادية وأخرى معكوسة تحتها مباشرة. هذان الصفّان هما جدول الشيفرة كاملًا.", math: "A B C … X Y Z\nZ Y X … C B A" },
        { title: "ابحث عن كل حرف", body: "لكل حرف في النص الأصلي، ابحث عنه في الصف العلوي وانسخ الحرف الذي تحته مباشرة.", math: "y = 25 − x" },
        { title: "لاحِظ التماثل", body: "ولأن القاعدة مرآة كاملة، فإن فك التشفير يستخدم نفس الجدول تمامًا. طبّق أتباش مرتين فتعود إلى نقطة البداية.", math: "25 − (25 − x) = x" },
      ],
      formula: {
        display: "E(x) = (25 − x) mod 26\nD(y) = (25 − y) mod 26",
        caption: "دالة بلا مفتاح وهي عكس نفسها",
        symbols: [
          { sym: "x", meaning: "رقم حرف النص الأصلي (A=0 … Z=25)" },
          { sym: "25 − x", meaning: "بُعد الحرف عن نهاية الأبجدية" },
          { sym: "E = D", meaning: "الدالة هي عكس نفسها (Involution)" },
        ],
      },
      example: {
        plaintext: "CRYPTO",
        keyLabel: "المفتاح",
        keyValue: "لا يوجد (مرآة ثابتة)",
        steps: [
          { title: "رقّم كل حرف", body: "حوّل CRYPTO إلى أرقام.", math: "C=2  R=17  Y=24  P=15  T=19  O=14" },
          { title: "اطرح من 25", body: "مرآة كل حرف هي بعده عن Z.", math: "25−2=23  25−17=8  25−24=1  25−15=10  25−19=6  25−14=11" },
          { title: "اقرأ الأحرف المعكوسة", body: "حوّل النتائج إلى أحرف.", math: "23=X  8=I  1=B  10=K  6=G  11=L" },
          { title: "تحقّق بإعادة التطبيق", body: "طبّق أتباش على XIBKGL فتعود CRYPTO — وهذا دليل على أنها عكس نفسها.", math: "Atbash(XIBKGL) = CRYPTO" },
        ],
        ciphertext: "XIBKGL",
      },
      strengths: [
        "لا إدارة مفاتيح إطلاقًا — لا شيء يُحفظ ولا شيء يُسرَّب.",
        "هي عكس نفسها، فدالة واحدة تشفّر وتفكّ التشفير.",
        "أصيلة تاريخيًا وموثّقة في مخطوطات عبرية قديمة.",
        "مثال فوري وواضح على الدوال العكسية للذات وعلى عائلة الشيفرات التآلفية.",
      ],
      weaknesses: [
        "يوجد تطابق واحد فقط حرفيًا — فالمهاجم لا يحتاج حتى للبحث في فضاء مفاتيح.",
        "تحليل التكرار يعمل عليها بشكل مثالي، وجدول التكرار معكوس ببساطة.",
        "يتعرف عليها أي مطّلع في لمح البصر وتُحل في ثوانٍ.",
        "غياب المفتاح يعني غياب أي سرية أمام خصم يعرف القراءة.",
      ],
      attacks: [
        { name: "التعرّف المباشر", desc: "ملاحظة منحنى التكرار المعكوس: أكثر حرف تكرارًا في النص المشفَّر يقابل أكثر حرف تكرارًا في اللغة معكوسًا.", cost: "فوري" },
        { name: "تحليل التكرار", desc: "إسقاط مدرّج تكرار النص المشفَّر على مدرّج اللغة المعكوس فينهار النص كاملًا دفعة واحدة.", cost: "ثوانٍ" },
        { name: "النص المعروف", desc: "كلمة واحدة مُخمَّنة تؤكّد قاعدة المرآة، والباقي يتبع ميكانيكيًا.", cost: "فوري" },
      ],
      verdict:
        "أتباش قطعة أثرية جميلة من تراث النسّاخ وأداة تعليمية رائعة لفهم الدوال العكسية — لكن بفضاء مفاتيح يساوي واحدًا فقط، فهي لا توفر أي حماية.",
      lab: {
        inputPlaceholder: "اكتب نصًا وشاهد الأبجدية تنطوي على نفسها…",
        presets: [
          { label: "الجذر العبري", value: "ALEPH TAV" },
          { label: "مرآة", value: "CRYPTOGRAPHY IS THE ART OF SECRETS" },
          { label: "دالة عكسية", value: "APPLY TWICE GET ORIGINAL" },
        ],
      },
    },
  },

  /* ============================= 3 · ROT13 ============================= */
  rot13: {
    en: {
      name: "ROT13",
      tagline: "Caesar with the shift welded shut at 13 — half the alphabet.",
      history:
        "ROT13 became famous on the early Usenet newsgroups of the 1980s. Editors used it to hide joke punchlines, puzzle answers and spoilers so that readers would only see them if they chose to. It was never meant as security — it was meant as a courtesy.",
      what: [
        "ROT13 is the Caesar cipher with the shift permanently fixed at 13. There is no key to choose: everyone already knows it is 13.",
        "Thirteen is a special number because it is exactly half of 26. Rotating by half the alphabet means the cipher maps onto itself: applying ROT13 twice returns the original text, which makes it an involution like Atbash.",
      ],
      how: [
        { title: "Fix the shift at 13", body: "Every letter moves 13 places forward.", math: "y = (x + 13) mod 26" },
        { title: "Discover the self-inverse", body: "Since 13 + 13 = 26 ≡ 0 (mod 26), the decryption function is identical to the encryption function.", math: "(x + 13 + 13) mod 26 = x" },
        { title: "Use one operation both ways", body: "The same routine encodes and decodes — which is why ROT13 spread so easily across early internet tools.", math: "ROT13(ROT13(m)) = m" },
      ],
      formula: {
        display: "E(x) = (x + 13) mod 26\nD(y) = (y + 13) mod 26",
        caption: "Half-turn rotation of the alphabet — encryption equals decryption",
        symbols: [
          { sym: "13", meaning: "half of 26, the only shift that is its own inverse" },
          { sym: "x", meaning: "letter index before rotation" },
          { sym: "mod 26", meaning: "wrap around the alphabet" },
        ],
      },
      example: {
        plaintext: "HELLO",
        keyLabel: "Shift",
        keyValue: "k = 13 (fixed)",
        steps: [
          { title: "Index the word", body: "H E L L O become numbers.", math: "H=7  E=4  L=11  L=11  O=14" },
          { title: "Add 13", body: "Rotate each index by half the alphabet.", math: "7+13=20  4+13=17  11+13=24  11+13=24  14+13=27" },
          { title: "Wrap the overflow", body: "27 exceeds 25, so subtract 26.", math: "27 mod 26 = 1" },
          { title: "Read the result", body: "20=U, 17=R, 24=Y, 24=Y, 1=B.", math: "HELLO → URYYB" },
          { title: "Apply it again", body: "URYYB rotated by 13 gives HELLO back — no separate decryption step needed.", math: "ROT13(URYYB) = HELLO" },
        ],
        ciphertext: "URYYB",
      },
      strengths: [
        "One operation both directions — the simplest possible round trip.",
        "Ideal for hiding spoilers and punchlines without any key exchange.",
        "Ubiquitous in internet culture; instantly recognisable and easy to explain.",
        "Teaches modular arithmetic and involutions with zero setup.",
      ],
      weaknesses: [
        "The key is public knowledge, so there is no secrecy of any kind.",
        "Frequency analysis still applies — the profile is just rotated by 13.",
        "It is routinely used as a punchline example of 'fake encryption' in real software.",
        "Provides no integrity, no authentication and no confidentiality.",
      ],
      attacks: [
        { name: "Apply ROT13", desc: "The attack is the algorithm. One rotation and the message is in the clear.", cost: "instant" },
        { name: "Frequency analysis", desc: "Even without knowing the shift, the reversed-half histogram exposes it.", cost: "seconds" },
        { name: "Pattern recognition", desc: "Common bigrams (HE, TH, IN) appear as UR, GU, VA — a dead giveaway.", cost: "instant" },
      ],
      verdict:
        "ROT13 is obfuscation, not encryption. It is a perfect cultural and pedagogical example of why 'hiding the text' and 'securing the text' are two completely different things.",
      lab: {
        inputPlaceholder: "Type something — encode and decode are the same button…",
        presets: [
          { label: "Spoiler", value: "THE BUTLER DID IT" },
          { label: "Usenet", value: "WHY DID THE CHICKEN CROSS THE ROAD" },
          { label: "Involution", value: "ROT13 TWICE IS NOTHING" },
        ],
      },
    },
    ar: {
      name: "شيفرة ROT13",
      tagline: "قيصر بإزاحة ملحومة عند 13 — نصف الأبجدية تمامًا.",
      history:
        "اشتهرت ROT13 في مجموعات يوزنت الإخبارية مطلع الثمانينيات، حيث استخدمها المحررون لإخفاء نهاية النكات وحلول الألغاز والمفسدات حتى لا يراها القارئ إلا باختياره. لم تُصمم للحماية إطلاقًا، بل للمجاملة.",
      what: [
        "ROT13 هي شيفرة قيصر بإزاحة ثابتة مقدارها 13 دائمًا. لا يوجد مفتاح للاختيار: الجميع يعرف مسبقًا أنه 13.",
        "والرقم 13 مميز لأنه نصف 26 تمامًا. الدوران بنصف الأبجدية يجعل الشيفرة تنطبق على نفسها: تطبيق ROT13 مرتين يُعيد النص الأصلي، فتصبح دالة عكسية لذاتها مثل أتباش.",
      ],
      how: [
        { title: "ثبّت الإزاحة على 13", body: "كل حرف يتقدم 13 موقعًا.", math: "y = (x + 13) mod 26" },
        { title: "اكتشف أنها عكس نفسها", body: "وبما أن 13 + 13 = 26 ≡ 0 (mod 26)، فإن دالة فك التشفير مطابقة تمامًا لدالة التشفير.", math: "(x + 13 + 13) mod 26 = x" },
        { title: "استخدم عملية واحدة للاتجاهين", body: "نفس الدالة تُشفّر وتفكّ التشفير — ولهذا انتشرت ROT13 بسهولة في أدوات الإنترنت المبكرة.", math: "ROT13(ROT13(m)) = m" },
      ],
      formula: {
        display: "E(x) = (x + 13) mod 26\nD(y) = (y + 13) mod 26",
        caption: "دوران نصف دورة — التشفير يساوي فك التشفير",
        symbols: [
          { sym: "13", meaning: "نصف الـ26، الإزاحة الوحيدة التي هي عكس نفسها" },
          { sym: "x", meaning: "رقم الحرف قبل الدوران" },
          { sym: "mod 26", meaning: "الالتفاف حول الأبجدية" },
        ],
      },
      example: {
        plaintext: "HELLO",
        keyLabel: "الإزاحة",
        keyValue: "k = 13 (ثابتة)",
        steps: [
          { title: "رقّم الكلمة", body: "حوّل H E L L O إلى أرقام.", math: "H=7  E=4  L=11  L=11  O=14" },
          { title: "أضف 13", body: "أدر كل رقم بنصف الأبجدية.", math: "7+13=20  4+13=17  11+13=24  11+13=24  14+13=27" },
          { title: "لفّ الفائض", body: "الرقم 27 تجاوز 25 فنطرح 26.", math: "27 mod 26 = 1" },
          { title: "اقرأ النتيجة", body: "20=U و 17=R و 24=Y و 24=Y و 1=B.", math: "HELLO → URYYB" },
          { title: "طبّقها مرة أخرى", body: "تدوير URYYB بمقدار 13 يعيد HELLO — فلا حاجة لخطوة فك تشفير منفصلة.", math: "ROT13(URYYB) = HELLO" },
        ],
        ciphertext: "URYYB",
      },
      strengths: [
        "عملية واحدة في الاتجاهين — أبسط رحلة ذهاب وعودة ممكنة.",
        "مثالية لإخفاء المفسدات ونهايات النكات دون أي تبادل للمفاتيح.",
        "منتشرة في ثقافة الإنترنت وسهلة الشرح والتعرّف.",
        "تعلّم الحساب النمطي والدوال العكسية دون أي تجهيز.",
      ],
      weaknesses: [
        "المفتاح معلَن ومعروف، فلا توجد أي سرية على الإطلاق.",
        "تحليل التكرار ما زال يعمل — المنحنى نفسه مُدار بمقدار 13 فقط.",
        "تُضرب بها الأمثال على «التشفير المزيف» في البرامج الحقيقية.",
        "لا توفر سلامة ولا توثيقًا ولا سرية.",
      ],
      attacks: [
        { name: "تطبيق ROT13", desc: "الهجوم هو الخوارزمية نفسها. دورة واحدة وتصبح الرسالة مكشوفة.", cost: "فوري" },
        { name: "تحليل التكرار", desc: "حتى دون معرفة الإزاحة، يكشفها مدرّج التكرار المُدار بالنصف.", cost: "ثوانٍ" },
        { name: "التعرّف على الأنماط", desc: "الأزواج الشائعة (HE, TH, IN) تظهر كـ (UR, GU, VA) وهي علامة لا تخطئ.", cost: "فوري" },
      ],
      verdict:
        "ROT13 تمويه وليست تشفيرًا. وهي مثال ثقافي وتعليمي مثالي على الفرق بين «إخفاء النص» و«حماية النص».",
      lab: {
        inputPlaceholder: "اكتب أي شيء — التشفير وفك التشفير زرّ واحد…",
        presets: [
          { label: "مفسد", value: "THE BUTLER DID IT" },
          { label: "يوزنت", value: "WHY DID THE CHICKEN CROSS THE ROAD" },
          { label: "دورة مزدوجة", value: "ROT13 TWICE IS NOTHING" },
        ],
      },
    },
  },

  /* ============================ 4 · VIGENÈRE ============================ */
  vigenere: {
    en: {
      name: "Vigenère Cipher",
      tagline: "The polyalphabetic leap — a keyword drives 26 different Caesar ciphers.",
      history:
        "Described by Giovan Battista Bellaso in 1553 and later popularised by Blaise de Vigenère, it was called 'le chiffre indéchiffrable' — the indecipherable cipher — and held that reputation for three centuries until Friedrich Kasiski published his examination method in 1863 and Babbage broke it privately years earlier.",
      what: [
        "Vigenère fixes the fatal flaw of Caesar: instead of one shift for the whole message, the shift changes from letter to letter according to a repeating keyword. Each letter of the keyword selects a different Caesar shift.",
        "That single change destroys frequency analysis in its naive form, because the same plaintext letter now maps to many different ciphertext letters depending on where it falls relative to the key. The cipher is polyalphabetic.",
      ],
      how: [
        { title: "Repeat the keyword", body: "Write the keyword under the plaintext, cycling it until it covers the whole message. Its length is the period.", math: "MSG: ATTACKATDAWN\nKEY: LEMONLEMONLE" },
        { title: "Convert key letters to shifts", body: "Each key letter becomes a number A=0…Z=25 which is the shift used at that position.", math: "L=11  E=4  M=12  O=14  N=13" },
        { title: "Add position by position", body: "Add the plaintext index and the key index, reduce modulo 26, and take the letter.", math: "C = (P + K) mod 26" },
        { title: "Decrypt by subtracting", body: "Subtract the key index and add 26 if negative, then reduce.", math: "P = (C − K + 26) mod 26" },
      ],
      formula: {
        display: "Cᵢ = (Pᵢ + Kᵢ mod |K|) mod 26\nPᵢ = (Cᵢ − Kᵢ mod |K| + 26) mod 26",
        caption: "A different Caesar shift for every position, chosen by the keyword",
        symbols: [
          { sym: "Pᵢ", meaning: "index of the i-th plaintext letter" },
          { sym: "Cᵢ", meaning: "index of the i-th ciphertext letter" },
          { sym: "Kⱼ", meaning: "index of the j-th keyword letter" },
          { sym: "|K|", meaning: "length of the keyword (the period)" },
        ],
      },
      example: {
        plaintext: "ATTACKATDAWN",
        keyLabel: "Keyword",
        keyValue: "LEMON",
        steps: [
          { title: "Tile the keyword", body: "Repeat LEMON under the 12 letters of the message.", math: "A T T A C K A T D A W N\nL E M O N L E M O N L E" },
          { title: "Encrypt the first letter", body: "A(0) + L(11) = 11 → L.", math: "(0 + 11) mod 26 = 11" },
          { title: "Watch the same letter diverge", body: "The letter A appears three times, under key letters L, O and N — so one plaintext letter produces three different ciphertext letters.", math: "A+L = 0+11 = 11 → L\nA+O = 0+14 = 14 → O\nA+N = 0+13 = 13 → N" },
          { title: "Continue through the cycle", body: "Every position consumes the next key letter, looping back to the start of LEMON when it runs out.", math: "C+N = 2+13 = 15 → P\nK+L = 10+11 = 21 → V" },
          { title: "Full ciphertext", body: "The result no longer carries the frequency signature of English — every E, T and A has been scattered.", math: "ATTACKATDAWN → LXFOPVEFRNHR" },
        ],
        ciphertext: "LXFOPVEFRNHR",
      },
      strengths: [
        "Defeats simple single-letter frequency analysis completely.",
        "Keyspace grows exponentially with keyword length: 26ⁿ possibilities.",
        "Simple to implement by hand with just a printed Tabula Recta.",
        "Historically one of the most influential ciphers ever devised.",
      ],
      weaknesses: [
        "The key repeats, so the ciphertext repeats with period |K| — the repetition is the crack.",
        "Kasiski examination finds the period by measuring distances between repeated ciphertext sequences.",
        "Once the period is known, the message splits into |K| independent Caesar ciphers, each solvable by frequency analysis.",
        "Short messages with long keys still leak through the index of coincidence.",
      ],
      attacks: [
        { name: "Kasiski examination", desc: "Find repeated substrings in the ciphertext; the gcd of the distances between them is very likely the keyword length.", cost: "minutes" },
        { name: "Index of coincidence", desc: "Compute IC for each candidate period; the correct period gives an IC near 0.066 (English) instead of 0.038 (random).", cost: "seconds, automated" },
        { name: "Friedman / statistical split", desc: "Split the text into n columns, run frequency analysis on each column, recover each key letter.", cost: "seconds on a computer" },
      ],
      verdict:
        "Vigenère was genuinely strong for 300 years and is the perfect demonstration of why key repetition — not the strength of the underlying operation — is what breaks a cipher.",
      lab: {
        inputPlaceholder: "Type the message; the keyword will tile beneath it…",
        presets: [
          { label: "Classic", value: "ATTACKATDAWN" },
          { label: "Longer text", value: "THE SECRET PASSWORD IS MIDNIGHT AND THE GATE OPENS AT TWELVE" },
          { label: "Diplomatic", value: "WE NEGOTIATE PEACE THROUGH STRENGTH NOT THROUGH FEAR" },
        ],
      },
    },
    ar: {
      name: "شيفرة فيجنير",
      tagline: "القفزة متعددة الأبجديات — كلمة مفتاح تقود 26 شيفرة قيصر مختلفة.",
      history:
        "وصفها جيوفان باتيستا بيلاسو عام 1553 ثم روّج لها بليز دو فيجنير، ولُقّبت بـ«الشيفرة التي لا تُفكّ»، واحتفظت بهذه السمعة ثلاثة قرون حتى نشر فريدريش كاسيسكي طريقته في الفحص عام 1863، وكان بابيج قد كسرها سرًا قبل ذلك بسنوات.",
      what: [
        "تُصلح فيجنير العيب القاتل في شيفرة قيصر: فبدل إزاحة واحدة لكل الرسالة، تتغير الإزاحة من حرف لآخر وفقًا لكلمة مفتاح متكررة. وكل حرف من كلمة المفتاح يختار إزاحة قيصر مختلفة.",
        "هذا التغيير وحده يدمّر تحليل التكرار في صورته البسيطة، لأن نفس الحرف في النص الأصلي أصبح يُنتج أحرفًا مختلفة بحسب موقعه بالنسبة إلى المفتاح. ولهذا نسميها شيفرة متعددة الأبجديات.",
      ],
      how: [
        { title: "كرّر كلمة المفتاح", body: "اكتب كلمة المفتاح تحت النص الأصلي وكرّرها حتى تغطي الرسالة كلها. طولها هو «الدورة».", math: "MSG: ATTACKATDAWN\nKEY: LEMONLEMONLE" },
        { title: "حوّل أحرف المفتاح إلى إزاحات", body: "كل حرف مفتاح يصبح رقمًا A=0…Z=25 وهو الإزاحة المستخدمة في ذلك الموضع.", math: "L=11  E=4  M=12  O=14  N=13" },
        { title: "اجمع موضعًا بموضع", body: "اجمع رقم حرف النص مع رقم حرف المفتاح ثم خذ باقي القسمة على 26.", math: "C = (P + K) mod 26" },
        { title: "فكّ التشفير بالطرح", body: "اطرح رقم حرف المفتاح وأضف 26 إذا كانت النتيجة سالبة ثم خذ الباقي.", math: "P = (C − K + 26) mod 26" },
      ],
      formula: {
        display: "Cᵢ = (Pᵢ + Kᵢ mod |K|) mod 26\nPᵢ = (Cᵢ − Kᵢ mod |K| + 26) mod 26",
        caption: "إزاحة قيصر مختلفة لكل موضع تختارها كلمة المفتاح",
        symbols: [
          { sym: "Pᵢ", meaning: "رقم الحرف i في النص الأصلي" },
          { sym: "Cᵢ", meaning: "رقم الحرف i في النص المشفَّر" },
          { sym: "Kⱼ", meaning: "رقم الحرف j في كلمة المفتاح" },
          { sym: "|K|", meaning: "طول كلمة المفتاح (الدورة)" },
        ],
      },
      example: {
        plaintext: "ATTACKATDAWN",
        keyLabel: "كلمة المفتاح",
        keyValue: "LEMON",
        steps: [
          { title: "افرِش كلمة المفتاح", body: "كرّر LEMON تحت الحروف الاثني عشر للرسالة.", math: "A T T A C K A T D A W N\nL E M O N L E M O N L E" },
          { title: "شفّر الحرف الأول", body: "A(0) + L(11) = 11 أي الحرف L.", math: "(0 + 11) mod 26 = 11" },
          { title: "شاهد نفس الحرف يتفرع", body: "الحرف A يتكرر ثلاث مرات تحت أحرف المفتاح L و O و N — فينتج حرف أصلي واحد ثلاثة أحرف مشفَّرة مختلفة.", math: "A+L = 0+11 = 11 → L\nA+O = 0+14 = 14 → O\nA+N = 0+13 = 13 → N" },
          { title: "أكمل عبر الدورة", body: "كل موضع يستهلك حرف المفتاح التالي، ويعود إلى بداية LEMON عندما تنتهي.", math: "C+N = 2+13 = 15 → P\nK+L = 10+11 = 21 → V" },
          { title: "النص المشفَّر الكامل", body: "النتيجة لم تعد تحمل البصمة التكرارية للإنجليزية — فقد تبعثرت كل E و T و A.", math: "ATTACKATDAWN → LXFOPVEFRNHR" },
        ],
        ciphertext: "LXFOPVEFRNHR",
      },
      strengths: [
        "تهزم تحليل التكرار الأحادي تمامًا.",
        "فضاء المفاتيح ينمو أسيًا مع طول الكلمة: 26ⁿ احتمال.",
        "سهلة التنفيذ يدويًا بجدول Tabula Recta مطبوع فقط.",
        "من أكثر الشيفرات تأثيرًا في التاريخ.",
      ],
      weaknesses: [
        "المفتاح يتكرر، فيتكرر النص المشفَّر بنفس الدورة — وهذا التكرار هو نقطة الكسر.",
        "فحص كاسيسكي يحدد طول الدورة بقياس المسافات بين التسلسلات المتكررة.",
        "وبمعرفة طول الدورة تنقسم الرسالة إلى |K| شيفرات قيصر مستقلة، كل واحدة تُحل بتحليل التكرار.",
        "الرسائل القصيرة مع مفاتيح طويلة ما زالت تسرّب معلومات عبر معامل التطابق.",
      ],
      attacks: [
        { name: "فحص كاسيسكي", desc: "ابحث عن مقاطع متكررة في النص المشفَّر؛ القاسم المشترك الأكبر للمسافات بينها هو على الأرجح طول كلمة المفتاح.", cost: "دقائق" },
        { name: "معامل التطابق (IC)", desc: "احسب IC لكل طول دورة مرشح؛ الطول الصحيح يعطي قيمة قريبة من 0.066 (الإنجليزية) بدل 0.038 (العشوائي).", cost: "ثوانٍ آليًا" },
        { name: "التقسيم الإحصائي", desc: "قسّم النص إلى n أعمدة وشغّل تحليل التكرار على كل عمود لاستعادة كل حرف من حروف المفتاح.", cost: "ثوانٍ على الحاسوب" },
      ],
      verdict:
        "فيجنير كانت قوية فعلًا لمدة 300 عام، وهي المثال الأكمل على أن تكرار المفتاح — لا ضعف العملية نفسها — هو ما يكسر الشيفرات.",
      lab: {
        inputPlaceholder: "اكتب الرسالة وستُفرش كلمة المفتاح تحتها…",
        presets: [
          { label: "كلاسيكي", value: "ATTACKATDAWN" },
          { label: "نص أطول", value: "THE SECRET PASSWORD IS MIDNIGHT AND THE GATE OPENS AT TWELVE" },
          { label: "دبلوماسي", value: "WE NEGOTIATE PEACE THROUGH STRENGTH NOT THROUGH FEAR" },
        ],
      },
    },
  },

  /* ============================= 5 · PLAYFAIR ============================= */
  playfair: {
    en: {
      name: "Playfair Cipher",
      tagline: "The first practical digraph cipher — encrypt pairs, not letters.",
      history:
        "Invented by Charles Wheatstone in 1854 but named after Lord Playfair, who promoted it to the British government. It was used operationally by British forces in the Boer War and in World War II — notably by Australian units — because it was fast, keyless in equipment, and secure enough for tactical messages.",
      what: [
        "Playfair encrypts pairs of letters (digraphs) instead of single letters, using a 5×5 grid filled with a keyword followed by the remaining alphabet. Since 26 letters do not fit in 25 cells, I and J share one cell.",
        "Encrypting digraphs is a genuine leap: there are 26×26 = 676 possible pairs, so the frequency profile of the ciphertext is far flatter and single-letter frequency analysis becomes useless.",
      ],
      how: [
        { title: "Build the 5×5 grid", body: "Write the keyword (deduplicated, J→I) across the grid, then fill the rest with the unused letters of the alphabet in order.", math: "PLAYFIREXAMPLE → P L A Y F / I R X E M / …" },
        { title: "Split into digraphs", body: "Take the message two letters at a time. If a pair contains the same letter twice, insert X (or Q if the letter is X) between them. If one letter is left over, append X.", math: "BALLOON → BA LX LO ON" },
        { title: "Apply the three rules", body: "Same row → take the letter to the right of each. Same column → take the letter below each. Rectangle → each letter takes the corner of its own row but the other letter's column.", math: "same row: +1 col   same col: +1 row   rectangle: swap columns" },
        { title: "Decrypt with the reverse rules", body: "Same row → move left. Same column → move up. Rectangle → identical rule, it is symmetric. Remove obvious filler X's afterwards.", math: "−1 col / −1 row / swap columns" },
      ],
      formula: {
        display: "Grid G ∈ 5×5,  pos(c) = (row, col)\nsame row:    (r, c) → (r, c+1 mod 5)\nsame col:    (r, c) → (r+1 mod 5, c)\nrectangle:   (r1,c1)(r2,c2) → (r1,c2)(r2,c1)",
        caption: "Three geometric rules applied to every digraph",
        symbols: [
          { sym: "G", meaning: "the 5×5 Polybius square built from the keyword" },
          { sym: "(r, c)", meaning: "row and column of a letter inside the grid" },
          { sym: "mod 5", meaning: "wrap around the edge of the grid" },
          { sym: "X / Q", meaning: "filler letters used to break repeated pairs" },
        ],
      },
      example: {
        plaintext: "HIDE THE GOLD",
        keyLabel: "Keyword",
        keyValue: "MONARCHY",
        steps: [
          { title: "Build the grid", body: "MONARCHY first, then the rest of the alphabet without J.", math: "M O N A R / C H Y B D / E F G I K / L P Q S T / U V W X Z" },
          { title: "Prepare the digraphs", body: "Remove spaces and split into pairs; no pair has identical letters here.", math: "HI DE TH EG OL DX" },
          { title: "HI — rectangle", body: "H sits at row 2 col 2 and I at row 3 col 4. Each letter keeps its own row and takes the other's column.", math: "H(2,2) → (2,4) = B\nI(3,4) → (3,2) = F      HI → BF" },
          { title: "DE — rectangle again", body: "D is at row 2 col 5, E at row 3 col 1 — the widest possible rectangle in the grid.", math: "D(2,5) → (2,1) = C\nE(3,1) → (3,5) = K      DE → CK" },
          { title: "EG — same row", body: "E and G both sit in row 3, so the row rule fires instead: each letter moves one cell to the right, wrapping at the edge.", math: "E(3,1) → (3,2) = F\nG(3,3) → (3,4) = I      EG → FI" },
          { title: "Result", body: "Every pair has been transformed geometrically. The trailing X we added is an artefact of padding and is dropped when reading the plaintext.", math: "HI DE TH EG OL DX →\nBF CK PD FI MP BZ" },
        ],
        ciphertext: "BFCKPDFIMPBZ",
      },
      strengths: [
        "Encrypts digraphs, so the 676-pair space flattens the frequency profile dramatically.",
        "Fast to operate by hand with no equipment — ideal for field tactical traffic.",
        "Defeats the single-letter frequency analysis that kills Caesar and Atbash.",
        "Large effective keyspace: the number of distinct 5×5 grids is about 25! / duplicates ≈ 10²⁴.",
      ],
      weaknesses: [
        "Digraph frequency analysis still works — common pairs like TH, HE, IN leave a visible trace.",
        "A letter never encrypts to a letter in its own row or column, which leaks grid structure.",
        "I and J are merged, so decryption is slightly lossy.",
        "Revealed instantly by a known-plaintext crib of moderate length.",
      ],
      attacks: [
        { name: "Digraph frequency analysis", desc: "Count pairs instead of letters and match them against the known bigram statistics of the language.", cost: "minutes with a computer" },
        { name: "Structural deduction", desc: "Use the rule that no ciphertext letter shares a row or column with its plaintext partner to pin down grid cells one at a time.", cost: "hours by hand" },
        { name: "Known plaintext", desc: "A crib of 10–15 letters usually reconstructs most of the 5×5 grid.", cost: "fast" },
      ],
      verdict:
        "Playfair was genuinely field-deployed for nearly a century. It teaches the crucial concept that encrypting groups of symbols — not single symbols — is the first real step toward modern block ciphers.",
      lab: {
        inputPlaceholder: "Type letters; they will be paired and placed on the grid…",
        presets: [
          { label: "Tactical", value: "HIDE THE GOLD IN THE CAVE" },
          { label: "Double letters", value: "BALLOON RISES AT NOON" },
          { label: "Odd length", value: "SEND SUPPLIES" },
        ],
      },
    },
    ar: {
      name: "شيفرة بلايفير",
      tagline: "أول شيفرة عملية للأزواج — تُشفّر حرفين معًا لا حرفًا واحدًا.",
      history:
        "اخترعها تشارلز ويتستون عام 1854 لكنها سُمّيت باسم اللورد بلايفير الذي روّج لها لدى الحكومة البريطانية. استُخدمت ميدانيًا في حرب البوير وفي الحرب العالمية الثانية — خاصة لدى الوحدات الأسترالية — لأنها سريعة ولا تحتاج أجهزة وآمنة بما يكفي للرسائل التكتيكية.",
      what: [
        "تُشفّر بلايفير أزواج الحروف (Digraphs) بدل الأحرف المفردة، باستخدام شبكة 5×5 تُملأ بكلمة مفتاح ثم ببقية الأبجدية. وبما أن 26 حرفًا لا تتسع في 25 خانة، فإن I و J تتشاركان خانة واحدة.",
        "وتشفير الأزواج قفزة حقيقية: إذ يوجد 26×26 = 676 زوجًا ممكنًا، فيصبح منحنى تكرار النص المشفَّر أكثر تسطيحًا بكثير ويغدو تحليل تكرار الحرف الواحد عديم الفائدة.",
      ],
      how: [
        { title: "ابنِ شبكة 5×5", body: "اكتب كلمة المفتاح (بعد حذف الأحرف المكررة وتحويل J إلى I) ثم أكمل الشبكة ببقية أحرف الأبجدية بالترتيب.", math: "PLAYFAIR → P L A Y F / I R X E M / …" },
        { title: "قسّم النص إلى أزواج", body: "خذ الرسالة حرفين حرفين. إذا كان الزوج حرفين متطابقين فأدخل X بينهما (أو Q إذا كان الحرف X). وإذا بقي حرف منفرد فأضف X في النهاية.", math: "BALLOON → BA LX LO ON" },
        { title: "طبّق القواعد الثلاث", body: "نفس الصف → خذ الحرف الذي على يمين كل حرف. نفس العمود → خذ الحرف الذي تحت كل حرف. مستطيل → كل حرف يأخذ زاوية صفّه هو وعمود الحرف الآخر.", math: "same row: +1 col   same col: +1 row   rectangle: swap columns" },
        { title: "فكّ التشفير بالعكس", body: "نفس الصف → تحرّك لليسار. نفس العمود → تحرّك لأعلى. المستطيل → نفس القاعدة لأنها متماثلة. ثم احذف أحرف الحشو الزائدة.", math: "−1 col / −1 row / swap columns" },
      ],
      formula: {
        display: "Grid G ∈ 5×5,  pos(c) = (row, col)\nsame row:    (r, c) → (r, c+1 mod 5)\nsame col:    (r, c) → (r+1 mod 5, c)\nrectangle:   (r1,c1)(r2,c2) → (r1,c2)(r2,c1)",
        caption: "ثلاث قواعد هندسية تُطبَّق على كل زوج",
        symbols: [
          { sym: "G", meaning: "مربع بوليبيوس 5×5 المبني من كلمة المفتاح" },
          { sym: "(r, c)", meaning: "صف وعمود الحرف داخل الشبكة" },
          { sym: "mod 5", meaning: "الالتفاف عند حافة الشبكة" },
          { sym: "X / Q", meaning: "أحرف الحشو لكسر الأزواج المتطابقة" },
        ],
      },
      example: {
        plaintext: "HIDE THE GOLD",
        keyLabel: "كلمة المفتاح",
        keyValue: "MONARCHY",
        steps: [
          { title: "ابنِ الشبكة", body: "MONARCHY أولًا ثم بقية الأبجدية بدون J.", math: "M O N A R / C H Y B D / E F G I K / L P Q S T / U V W X Z" },
          { title: "جهّز الأزواج", body: "احذف المسافات وقسّم إلى أزواج؛ لا يوجد هنا زوج بحرفين متطابقين.", math: "HI DE TH EG OL DX" },
          { title: "HI — مستطيل", body: "H في الصف 2 العمود 2، و I في الصف 3 العمود 4. كل حرف يحتفظ بصفّه ويأخذ عمود الآخر.", math: "H(2,2) → (2,4) = B\nI(3,4) → (3,2) = F      HI → BF" },
          { title: "DE — مستطيل أيضًا", body: "D في الصف 2 العمود 5، و E في الصف 3 العمود 1 — أوسع مستطيل ممكن في الشبكة.", math: "D(2,5) → (2,1) = C\nE(3,1) → (3,5) = K      DE → CK" },
          { title: "EG — نفس الصف", body: "E و G يقعان في الصف 3، فتعمل قاعدة الصف: يتحرك كل حرف خلية واحدة لليمين مع الالتفاف عند الحافة.", math: "E(3,1) → (3,2) = F\nG(3,3) → (3,4) = I      EG → FI" },
          { title: "النتيجة", body: "كل زوج تحوّل هندسيًا. وحرف X الذي أضفناه في النهاية أثر من آثار الحشو ويُحذف عند قراءة النص الأصلي.", math: "HI DE TH EG OL DX →\nBF CK PD FI MP BZ" },
        ],
        ciphertext: "BFCKPDFIMPBZ",
      },
      strengths: [
        "تُشفّر أزواجًا، ففضاء الـ676 زوجًا يُسطّح منحنى التكرار بشكل كبير.",
        "سريعة التنفيذ يدويًا دون أي أجهزة — مثالية للاتصالات الميدانية.",
        "تهزم تحليل تكرار الحرف الواحد الذي يقتل شيفرتي قيصر وأتباش.",
        "فضاء مفاتيح فعال ضخم: عدد الشبكات المميزة يقارب 10²⁴.",
      ],
      weaknesses: [
        "تحليل تكرار الأزواج ما زال يعمل — فالأزواج الشائعة مثل TH و HE و IN تترك أثرًا.",
        "الحرف لا يُشفَّر أبدًا إلى حرف في نفس صفه أو عموده، وهذا يسرّب بنية الشبكة.",
        "دمج I مع J يجعل فك التشفير يفقد معلومة طفيفة.",
        "تنكشف فورًا بهجوم النص المعروف إذا كان القريب متوسط الطول.",
      ],
      attacks: [
        { name: "تحليل تكرار الأزواج", desc: "احسب تكرار الأزواج بدل الأحرف وطابقها مع إحصاءات Bigram المعروفة للغة.", cost: "دقائق بالحاسوب" },
        { name: "الاستنتاج البنيوي", desc: "استخدم قاعدة أن حرف النص المشفَّر لا يشارك صف أو عمود نظيره الأصلي لتحديد خانات الشبكة واحدة تلو الأخرى.", cost: "ساعات يدويًا" },
        { name: "النص المعروف", desc: "قريب من 10–15 حرفًا يعيد بناء معظم الشبكة 5×5.", cost: "سريع" },
      ],
      verdict:
        "بلايفير استُخدمت ميدانيًا لما يقارب قرنًا كاملًا. وهي تعلّمنا المفهوم الحاسم: تشفير مجموعات من الرموز لا رموز مفردة هو أول خطوة حقيقية نحو الشيفرات الكتلية الحديثة.",
      lab: {
        inputPlaceholder: "اكتب أحرفًا وسيتم تزويجها ووضعها على الشبكة…",
        presets: [
          { label: "تكتيكي", value: "HIDE THE GOLD IN THE CAVE" },
          { label: "حروف مزدوجة", value: "BALLOON RISES AT NOON" },
          { label: "طول فردي", value: "SEND SUPPLIES" },
        ],
      },
    },
  },

  /* =========================== 6 · RAIL FENCE =========================== */
  railfence: {
    en: {
      name: "Rail Fence Cipher",
      tagline: "Zig-zag transposition — the letters stay, their order changes.",
      history:
        "One of the oldest transposition techniques, used by ancient Greek and Roman writers and later by American Civil War telegraphers. It is the simplest member of the route-transposition family, where the secret is the path the message is written along.",
      what: [
        "Unlike substitution ciphers, transposition ciphers never change the letters themselves — they only change their order. The Rail Fence writes the message in a zig-zag across a fixed number of horizontal 'rails', then reads off each rail in turn.",
        "Because the letter frequencies are completely untouched, the ciphertext has exactly the same statistical fingerprint as the plaintext. What is hidden is the structure, not the content.",
      ],
      how: [
        { title: "Choose the number of rails", body: "The rail count is the key. Two rails gives a trivial split; three or more produces a real zig-zag.", math: "rails = k" },
        { title: "Write the zig-zag", body: "Move down one rail per character until you hit the bottom rail, then reverse direction upward until the top, and repeat. The vertical period is 2(k−1).", math: "rail(i) = p < k ? p : 2(k−1) − p,  p = i mod 2(k−1)" },
        { title: "Read rail by rail", body: "Concatenate all characters of rail 1, then rail 2, and so on. That concatenation is the ciphertext.", math: "C = row₁ ‖ row₂ ‖ … ‖ rowₖ" },
        { title: "Decrypt by rebuilding the path", body: "Compute how many characters belong to each rail, cut the ciphertext into those groups, then walk the zig-zag path again and pick one character from the matching rail at each step.", math: "same path, different reading order" },
      ],
      formula: {
        display: "rail(i) = p if p < k else 2(k−1) − p\nwhere p = (i + offset) mod 2(k−1)",
        caption: "A triangular wave that assigns every position to a rail",
        symbols: [
          { sym: "i", meaning: "index of the character in the message" },
          { sym: "k", meaning: "number of rails (the key)" },
          { sym: "p", meaning: "position inside one zig-zag cycle" },
          { sym: "offset", meaning: "optional phase shift of the wave" },
          { sym: "2(k−1)", meaning: "the length of one full down-up cycle" },
        ],
      },
      example: {
        plaintext: "ATTACKATDAWN",
        keyLabel: "Rails",
        keyValue: "k = 3",
        steps: [
          { title: "Draw the zig-zag", body: "Write the message along a wave that drops to rail 3 and climbs back to rail 1. One full down-up cycle covers 2(k−1) = 4 characters.", math: "A . . . C . . . D . . .\n. T . A . K . T . A . N\n. . T . . . A . . . W ." },
          { title: "Read rail 1", body: "Take only the characters that landed on the top rail.", math: "A C D → ACD" },
          { title: "Read rail 2", body: "Then the middle rail, which carries half the message.", math: "T A K T A N → TAKTAN" },
          { title: "Read rail 3", body: "Finally the bottom rail — it only catches every fourth character.", math: "T A W → TAW" },
          { title: "Concatenate", body: "Join the three rails end to end. No arithmetic was needed: pure reordering.", math: "ACD + TAKTAN + TAW" },
        ],
        ciphertext: "ACDTAKTANTAW",
      },
      strengths: [
        "Preserves the letters exactly, which makes it easy to combine with substitution in a product cipher.",
        "Very fast, no arithmetic, and works on any character set including digits and punctuation.",
        "The offset parameter adds a phase dimension to the key.",
        "Excellent demonstration of the difference between confusion and diffusion.",
      ],
      weaknesses: [
        "The keyspace is tiny — for a message of length n there are only about n/2 useful rail counts.",
        "Letter frequencies are completely unchanged, so a frequency test immediately proves it is a transposition.",
        "Anagramming: rearranging short blocks of ciphertext reveals the plaintext without knowing the key.",
        "Trivially brute-forced by trying every rail count and offset.",
      ],
      attacks: [
        { name: "Exhaustive rail search", desc: "Decrypt with every rail count from 2 up to half the message length; a human eye picks the meaningful one instantly.", cost: "milliseconds" },
        { name: "Anagramming", desc: "Take blocks of the ciphertext and permute them looking for real words.", cost: "minutes" },
        { name: "Statistical detection", desc: "If the frequency histogram matches the language exactly but the text is unreadable, it must be a transposition.", cost: "instant" },
      ],
      verdict:
        "Rail Fence is the purest illustration of diffusion: hide the order, not the identity. On its own it is weak, but layered under a substitution cipher it becomes a real building block.",
      lab: {
        inputPlaceholder: "Type a message and watch it ride the rails…",
        presets: [
          { label: "Classic", value: "WE ARE DISCOVERED FLEE AT ONCE" },
          { label: "Short", value: "ATTACK THE EAST WALL" },
          { label: "Long", value: "CRYPTOGRAPHY IS THE PRACTICE OF SECURE COMMUNICATION" },
        ],
      },
    },
    ar: {
      name: "شيفرة السياج الحديدي",
      tagline: "تبديل متعرّج — الأحرف تبقى كما هي، وترتيبها هو الذي يتغير.",
      history:
        "من أقدم تقنيات التبديل، استخدمها الكتّاب الإغريق والرومان ثم موظفو التلغراف في الحرب الأهلية الأمريكية. وهي أبسط عضو في عائلة «تبديل المسار» حيث يكون السرّ هو المسار الذي تُكتب عليه الرسالة.",
      what: [
        "على عكس شيفرات الاستبدال، لا تغيّر شيفرات التبديل الأحرف نفسها إطلاقًا — بل تغيّر ترتيبها فقط. ففي السياج الحديدي تُكتب الرسالة بشكل متعرّج فوق عدد ثابت من «القضبان» الأفقية، ثم تُقرأ قضيبًا قضيبًا.",
        "ولأن تكرارات الأحرف تبقى سليمة تمامًا، فإن النص المشفَّر يحمل نفس البصمة الإحصائية للنص الأصلي تمامًا. فالذي يُخفى هو البنية لا المحتوى.",
      ],
      how: [
        { title: "اختر عدد القضبان", body: "عدد القضبان هو المفتاح. قضيبان يعطيان تقسيمًا تافهًا، وثلاثة أو أكثر تنتج تعرجًا حقيقيًا.", math: "rails = k" },
        { title: "ارسم التعرّج", body: "انزل قضيبًا واحدًا لكل حرف حتى تصل إلى القضيب الأخير، ثم اعكس الاتجاه صعودًا حتى الأعلى وكرر. الدورة الرأسية طولها 2(k−1).", math: "rail(i) = p < k ? p : 2(k−1) − p,  p = i mod 2(k−1)" },
        { title: "اقرأ قضيبًا بعد قضيب", body: "اوصل كل أحرف القضيب الأول ثم الثاني وهكذا. هذا التوالي هو النص المشفَّر.", math: "C = row₁ ‖ row₂ ‖ … ‖ rowₖ" },
        { title: "فكّ التشفير بإعادة بناء المسار", body: "احسب عدد الأحرف التي تخص كل قضيب، وقصّ النص المشفَّر إلى هذه المجموعات، ثم امشِ على المسار المتعرّج مرة أخرى وخذ حرفًا واحدًا من القضيب المناسب في كل خطوة.", math: "same path, different reading order" },
      ],
      formula: {
        display: "rail(i) = p if p < k else 2(k−1) − p\nwhere p = (i + offset) mod 2(k−1)",
        caption: "موجة مثلثية تُسند كل موضع إلى قضيب",
        symbols: [
          { sym: "i", meaning: "رقم الحرف داخل الرسالة" },
          { sym: "k", meaning: "عدد القضبان (المفتاح)" },
          { sym: "p", meaning: "الموضع داخل دورة التعرّج الواحدة" },
          { sym: "offset", meaning: "إزاحة الطور الاختيارية للموجة" },
          { sym: "2(k−1)", meaning: "طول دورة كاملة نزولًا وصعودًا" },
        ],
      },
      example: {
        plaintext: "ATTACKATDAWN",
        keyLabel: "القضبان",
        keyValue: "k = 3",
        steps: [
          { title: "ارسم التعرّج", body: "اكتب الرسالة على موجة تنزل إلى القضيب 3 ثم تصعد إلى القضيب 1. والدورة الكاملة نزولًا وصعودًا تغطي 2(k−1) = 4 أحرف.", math: "A . . . C . . . D . . .\n. T . A . K . T . A . N\n. . T . . . A . . . W ." },
          { title: "اقرأ القضيب الأول", body: "خذ الأحرف التي وقعت على القضيب العلوي فقط.", math: "A C D → ACD" },
          { title: "اقرأ القضيب الثاني", body: "ثم القضيب الأوسط الذي يحمل نصف الرسالة.", math: "T A K T A N → TAKTAN" },
          { title: "اقرأ القضيب الثالث", body: "وأخيرًا القضيب السفلي — ولا يلتقط إلا كل حرف رابع.", math: "T A W → TAW" },
          { title: "اوصل النتائج", body: "اوصل القضبان الثلاثة طرفًا بطرف. لم نحتج أي حساب: إعادة ترتيب خالصة.", math: "ACD + TAKTAN + TAW" },
        ],
        ciphertext: "ACDTAKTANTAW",
      },
      strengths: [
        "تحفظ الأحرف كما هي تمامًا، ما يجعلها سهلة الدمج مع الاستبدال في شيفرة مركّبة.",
        "سريعة جدًا بلا حساب، وتعمل مع أي مجموعة رموز بما فيها الأرقام وعلامات الترقيم.",
        "معامل الإزاحة يضيف بُعد طور إلى المفتاح.",
        "مثال ممتاز على الفرق بين التشويش والانتشار.",
      ],
      weaknesses: [
        "فضاء المفاتيح صغير — لرسالة طولها n يوجد نحو n/2 عدد قضبان مفيد فقط.",
        "تكرارات الأحرف لا تتغير إطلاقًا، فاختبار التكرار يثبت فورًا أنها شيفرة تبديل.",
        "إعادة الترتيب (Anagramming) لمقاطع قصيرة يكشف النص الأصلي دون معرفة المفتاح.",
        "تُكسر بسهولة بتجربة كل عدد قضبان وكل إزاحة.",
      ],
      attacks: [
        { name: "البحث الشامل عن عدد القضبان", desc: "فكّ التشفير بكل عدد قضبان من 2 حتى نصف طول الرسالة؛ والعين البشرية تلتقط النص المفهوم فورًا.", cost: "أجزاء من الثانية" },
        { name: "إعادة الترتيب", desc: "خذ مقاطع من النص المشفَّر وبادِل بينها بحثًا عن كلمات حقيقية.", cost: "دقائق" },
        { name: "الكشف الإحصائي", desc: "إذا كان مدرّج التكرار مطابقًا للغة تمامًا والنص غير مقروء، فلا بد أنها شيفرة تبديل.", cost: "فوري" },
      ],
      verdict:
        "السياج الحديدي أنقى تعبير عن مفهوم الانتشار: أخفِ الترتيب لا الهوية. وهي ضعيفة وحدها، لكنها عند تركيبها تحت شيفرة استبدال تصبح لبنة حقيقية.",
      lab: {
        inputPlaceholder: "اكتب رسالة وشاهدها تسير على القضبان…",
        presets: [
          { label: "كلاسيكي", value: "WE ARE DISCOVERED FLEE AT ONCE" },
          { label: "قصير", value: "ATTACK THE EAST WALL" },
          { label: "طويل", value: "CRYPTOGRAPHY IS THE PRACTICE OF SECURE COMMUNICATION" },
        ],
      },
    },
  },
};
