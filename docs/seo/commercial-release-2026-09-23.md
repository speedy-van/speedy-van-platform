# نشر تحسينات الاستهداف التجاري — 23 سبتمبر 2026

**نُشرت التغييرات على الإنتاج بنجاح عند 10:47:09 UTC، الموافق 11:47:09 بتوقيت بريطانيا.** هذا السجل يحدّث حالة النشر دون إعادة كتابة نتائج الفحوص التاريخية في الملفات السابقة.

| العنصر | النتيجة المثبتة |
| --- | --- |
| التزام التطبيق المنشور | `9bf77d65066d3b505ffa14eee9e7d3425eb8b6aa` |
| شجرة المصدر المطابقة محليًا وعلى GitHub | `26d33175c487a936e448b5e7d7ef489fbc5539e2` |
| الأصل قبل رفع التغييرات | `52279359c910b88dda260e935b57e53ceae3c523` |
| الفرع | `fix/organic-search-and-booking-2026-09-21` |
| مجلد تطبيق الويب | `apps/web` |
| إصدار المعاينة | `EtgHMqQYXaTae4qMuLy5t8TKdpkm` — Ready عند 10:42:55 UTC |
| إصدار الإنتاج | `BL6r4WMVZ66vtaVXwGoycHNMo1Ht` — Ready، مدة البناء دقيقة و52 ثانية |
| الأصل الأساسي | `https://www.speedyvan.uk` |
| نقطة التراجع | `GYD2pB6EKuW3iRStSwR9Du96QrMP`، مصدر `48fcf7ff73ee4d8e5ba2b97a9f630e24b9e15718` |
| إنتاج الـAPI، أُعيد التحقق منه بعد النشر | `5woPnYouSe8kAHqwCsp1o5QoxzSg`، مصدر `5e5881a27cca0f6a602473c78a25c13369d1afc5`؛ لم يتغير |

تم رفع 11 ملف تطبيق وملف تحقق واحد، وتشمل تحسينات المدينتين والخدمات ودليل المقارنة والأسعار والروابط الداخلية وخريطة الموقع. تطابقت شجرة GitHub بالكامل مع الشجرة المحضّرة من الملفات المختبَرة. كان تحديث الفرع fast-forward دون force، ولم يُدمج في `main`.

أعاد زر **Promote to Production** بناء المصدر نفسه باستخدام بيئة الإنتاج، ثم ربطه بالنطاقات الحالية. لم تُنشر ملفات بناء محلية أو إعدادات تطوير بوصفها إنتاجًا. بقيت إعدادات npm وNext.js وReact وTailwind، وأوامر التثبيت وبناء Prisma وتطبيق الويب، دون تعديل. لم تُجر هجرة أو seed أو تعديل بيانات قاعدة البيانات.

## أدلة التحقق

- نجحت الفحوص المحلية الأخيرة: TypeScript وLint وبناء الويب و`git diff --check`، و120 اختبار انحدار و549 تحققًا من HTTP وHTML الأولي. معرّف البناء المحلي `nd0ekd3528h-Ez-dZ7IN0`.
- نجح البناء السحابي للمعاينة وللإنتاج من الالتزام نفسه.
- في المعاينة، ظهرت العناوين والمحتوى الجديد، وعملت الأسئلة الأربعة لكل مدينة بمفتاحَي Enter وSpace مع تركيز ظاهر. فتح زر طلب العرض `/book` بالحالة الفارغة المتوقعة، وكان Continue معطلًا دون اختيار خدمة.
- على الموقع الحي، ظهرت عناوين المدينتين الجديدة وروابط الأقسام الستة. فُتحت الأسئلة الثمانية بـEnter وأُغلقت بـSpace، وانتقل Tab إلى السؤال التالي ثم رابط المنطقة المجاورة.
- فتح زر كل مدينة `/book` مع تطابق عنوان خطوة الحجز وملخص المسودة وحقلي العناوين قبل الانتقال وبعده. هذه مقارنة للواجهة المرئية فقط؛ لم تُقرأ بيانات التخزين الداخلي أو تُعدّل العناصر أو الغرف أو بيانات الدفع، ولم يُرسل حجز أو دفعة.
- كان العرض المقاس 1348 بكسل، مساويًا لعرض التمرير في المدينتين. **لم يُستكمل فحص 360 و768 بكسل** لأن أداة المتصفح المتاحة لا تتيح تغيير المقاس. لا تُنسب نتائج سطح المكتب إلى الموبايل.
- أعادت عينة سجل المتصفح 28 مدخلاً بعد وقت النشر، جميعها من إضافة المتصفح، دون تحذير أو خطأ من التطبيق ضمن العينة. هذا ليس تدقيقًا شاملاً لسجلات الخادم أو اختبار دفع.
- بقيت الملفات الـ54 المسجلة عند بداية المتابعة مطابقة لبصماتها، وبقيت شجرة العمل المحلية والفهرس محفوظين. لم تُرفع الحزم الضخمة أو المعاينات المضمّنة أو ذاكرة البناء المؤقتة إلى التزام التطبيق.

فحص HTTP الحي الموسع **جزئي**: أكّد جلب خريطة الموقع وجود 49 رابطًا. في الفحص المحدود زمنيًا، اكتملت 31 استجابة HTTP 200 ونجح 42 تحققًا؛ انتهت مهلة 9 طلبات، ولم يبدأ 14 طلبًا قبل نهاية المهلة. لم يُثبت عيب محتوى في الاستجابات المكتملة. بقيت 13 نتيجة محتوى معتمدة على استجابات غير مكتملة دون تحقق؛ لا تُقدّم كعيوب canonical أو كمكاسب نجاح. توقف فحص سابق دون نتائج محفوظة، وسجله التاريخي لم يُستبدل. التفاصيل في `commercial-production-curl-review-2026-09-23.md` و`evidence/commercial-production-curl-2026-09-23.json`.

الأدلة: `evidence/commercial-release-source-2026-09-23.json` ونتيجة HTTP المشار إليها أعلاه. تحتوي حزمة التسليم أيضًا على لقطة تأكيد الإنتاج `evidence/commercial-production-ready-2026-09-23.jpg` وسجلات `commercial-followup-2026-09-23-*` والملفات المصدرية الكاملة.

## التراجع والمتابعة

عند ظهور خلل متعلق بهذا الإصدار، استخدم **Instant Rollback** لمشروع الويب لاستعادة `GYD2pB6EKuW3iRStSwR9Du96QrMP`، ثم افحص المدينتين والحجز. اترك إنتاج الـAPI كما هو. لتراجع المصدر، اعكس الالتزام الجديد على رأس الفرع الحالي بعد حفظ أي عمل أحدث؛ لا تستخدم reset أو force push. لم يُنفذ تراجع خلال هذا العمل.

ما زال تتبع الإنتاج الآلي يشير إلى `main`. هذا النشر اليدوي لا يغيّر ذلك الإعداد؛ قد يستبدله إصدار لاحق من `main`. لم يُغيّر تتبع الفرع أو DNS أو متغيرات البيئة أو صلاحيات الحسابات.

الخطوات المتبقية هي فحص الموبايل بالمقاسين في متصفح يتيح ذلك، ومتابعة الفهرسة والاستعلامات والتحويلات من خط أساس موثق. لم تُرسل مراسلات اكتساب الروابط، ولم تُنشأ روابط خارجية خلال النشر. نجاح الإصدار لا يثبت زيادة الترتيب أو الفهرسة أو الحجوزات.

## Copilot verification prompt

```text
Inspect deployed application commit 9bf77d65066d3b505ffa14eee9e7d3425eb8b6aa and read docs/seo/commercial-release-2026-09-23.md. Preserve every local change. Verify /areas/inverness and /areas/aberdeen at actual 360px and 768px in a permitted browser. Inspect apps/web/src/components/areas/AreaGuideContent.tsx (AreaGuideContent; area: Area, guide: AreaGuide), apps/web/src/lib/area-guides.ts (AreaGuide, getAreaGuide) and apps/web/src/app/(site)/areas/[slug]/page.tsx (AreaPage, generateMetadata; params: Promise<{ slug: string }>). Discover the current imports and keep buildPageMetadata and native details/summary semantics. Test wrapping, visible focus, Tab/Enter/Space, fragment navigation and plain /book entry with semantic draft preservation. Preserve item/room/bedroom inventory, checkout identity, pricing, API and payment contracts; do not submit bookings or payments. Keep existing loading, empty, validation and error states. Fix only demonstrated defects and rerun the documented checks after any source change. Record blockers honestly; do not claim desktop checks prove mobile behaviour or publishing proves rankings. Do not redeploy or send outreach without a new explicit request. Report in Arabic.
```
