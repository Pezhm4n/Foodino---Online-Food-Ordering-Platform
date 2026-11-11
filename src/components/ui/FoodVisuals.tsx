import React from 'react';

export type FoodVisualKind =
  | 'pizza'
  | 'burger'
  | 'iranian'
  | 'sushi'
  | 'salad'
  | 'sides'
  | 'drink'
  | 'chef';

export interface IconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * تشخیص هوشمند نوع تصویرسازی غذا بر اساس اسلاگ، نام غذا، دسته‌بندی یا ایموجی دیتابیس
 */
export function resolveFoodKind(...inputs: Array<string | null | undefined>): FoodVisualKind {
  const combined = inputs.filter(Boolean).join(' ').toLowerCase();

  if (
    combined.includes('پیتزا') ||
    combined.includes('pizza') ||
    combined.includes('پپرونی') ||
    combined.includes('مارگاریتا') ||
    combined.includes('ایتالیایی') ||
    combined.includes('🍕')
  ) {
    return 'pizza';
  }

  if (
    combined.includes('سوشی') ||
    combined.includes('sushi') ||
    combined.includes('سالمون') ||
    combined.includes('نگهداری') ||
    combined.includes('نودل') ||
    combined.includes('رامِن') ||
    combined.includes('آسیایی') ||
    combined.includes('تاکو') ||
    combined.includes('🍣') ||
    combined.includes('🍜')
  ) {
    return 'sushi';
  }

  if (
    combined.includes('ایرانی') ||
    combined.includes('سنتی') ||
    combined.includes('کباب') ||
    combined.includes('کوبیده') ||
    combined.includes('جوجه') ||
    combined.includes('قورمه') ||
    combined.includes('قیمه') ||
    combined.includes('تهچین') ||
    combined.includes('زعفرانی') ||
    combined.includes('چلو') ||
    combined.includes('iranian') ||
    combined.includes('traditional') ||
    combined.includes('🍚') ||
    combined.includes('🍲') ||
    combined.includes('🍖')
  ) {
    return 'iranian';
  }

  if (
    combined.includes('سالاد') ||
    combined.includes('سالم') ||
    combined.includes('رژیمی') ||
    combined.includes('کینوا') ||
    combined.includes('سزار') ||
    combined.includes('سبز') ||
    combined.includes('salad') ||
    combined.includes('healthy') ||
    combined.includes('🥗') ||
    combined.includes('🥑')
  ) {
    return 'salad';
  }

  if (
    combined.includes('سیب‌زمینی') ||
    combined.includes('سیب زمینی') ||
    combined.includes('پیاز سوخاری') ||
    combined.includes('نان سیر') ||
    combined.includes('پیش‌غذا') ||
    combined.includes('کنار غذا') ||
    combined.includes('سوخاری') ||
    combined.includes('fries') ||
    combined.includes('onion') ||
    combined.includes('garlic') ||
    combined.includes('🍟') ||
    combined.includes('🧅') ||
    combined.includes('🥖')
  ) {
    return 'sides';
  }

  if (
    combined.includes('نوشیدنی') ||
    combined.includes('موهیتو') ||
    combined.includes('دوغ') ||
    combined.includes('نوشابه') ||
    combined.includes('لیمو') ||
    combined.includes('drink') ||
    combined.includes('🥤') ||
    combined.includes('🍹')
  ) {
    return 'drink';
  }

  if (
    combined.includes('برگر') ||
    combined.includes('چیزبرگر') ||
    combined.includes('همبرگر') ||
    combined.includes('ساندویچ') ||
    combined.includes('burger') ||
    combined.includes('🍔')
  ) {
    return 'burger';
  }

  return 'chef';
}

export const FOOD_VISUAL_PALETTE: Record<
  FoodVisualKind,
  {
    bgStart: string;
    bgEnd: string;
    accent: string;
    tagBg: string;
    tagColor: string;
    label: string;
  }
> = {
  pizza: {
    bgStart: '#3A130C',
    bgEnd: '#8F2412',
    accent: '#FF6B35',
    tagBg: '#FEF2EC',
    tagColor: '#B82B14',
    label: 'تنوری و دست‌ساز',
  },
  burger: {
    bgStart: '#2A1810',
    bgEnd: '#6E3219',
    accent: '#F59E0B',
    tagBg: '#FFF7E6',
    tagColor: '#9E5F08',
    label: 'کباب زغالی',
  },
  iranian: {
    bgStart: '#2D1A0B',
    bgEnd: '#7C4710',
    accent: '#FBBF24',
    tagBg: '#FEF9E7',
    tagColor: '#8E5607',
    label: 'زعفرانی اصیل',
  },
  sushi: {
    bgStart: '#141E28',
    bgEnd: '#2A4359',
    accent: '#FB7185',
    tagBg: '#FFF1F2',
    tagColor: '#BE123C',
    label: 'تازه و دست‌پیچ',
  },
  salad: {
    bgStart: '#0E291B',
    bgEnd: '#1E5638',
    accent: '#4ADE80',
    tagBg: '#ECFDF3',
    tagColor: '#15803D',
    label: 'ارگانیک و تازه',
  },
  sides: {
    bgStart: '#331F0E',
    bgEnd: '#7D4918',
    accent: '#FBBF24',
    tagBg: '#FEF6E7',
    tagColor: '#9A5B13',
    label: 'ترد و داغ',
  },
  drink: {
    bgStart: '#112A32',
    bgEnd: '#1E5262',
    accent: '#38BDF8',
    tagBg: '#F0F9FF',
    tagColor: '#0369A1',
    label: 'خنک و گوارا',
  },
  chef: {
    bgStart: '#231712',
    bgEnd: '#5E2418',
    accent: '#EA6A47',
    tagBg: '#FEF4F0',
    tagColor: '#B82B14',
    label: 'منتخب سرآشپز',
  },
};

/**
 * نشان اختصاصی برند فودینو (Foodino Craft Emblem)
 */
export const FoodinoEmblem: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect width="48" height="48" rx="14" fill="url(#foodino_emblem_bg)" />
    <rect
      x="1"
      y="1"
      width="46"
      height="46"
      rx="13"
      stroke="rgba(255,255,255,0.22)"
      strokeWidth="1.2"
    />
    {/* زعفران / شعله گرم بالای سرپوش */}
    <path
      d="M24 9.5C24 9.5 28.2 12.8 26.8 16.4C25.9 18.6 23.2 19 23.2 19C23.2 19 21.1 16.3 22.4 13.1C23.1 11.4 24 9.5 24 9.5Z"
      fill="#FCD34D"
    />
    {/* گنبد سرپوش سرآشپز (Cloche) */}
    <path
      d="M12 28.5C12 21.8726 17.3726 16.5 24 16.5C30.6274 16.5 36 21.8726 36 28.5H12Z"
      fill="#FFFDF9"
    />
    {/* بازتاب ظریف روی سرپوش */}
    <path
      d="M16.5 26C17.4 22.1 20.5 19.5 24 19.5"
      stroke="#D9381E"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.45"
    />
    {/* سینی زیر سرپوش */}
    <rect x="9.5" y="30.5" width="29" height="3.5" rx="1.75" fill="#FDE68A" />
    {/* پایه ظرف */}
    <path
      d="M16 34H32L29.5 37.5H18.5L16 34Z"
      fill="rgba(255,253,249,0.85)"
    />
    <defs>
      <linearGradient
        id="foodino_emblem_bg"
        x1="4"
        y1="4"
        x2="44"
        y2="44"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#E64825" />
        <stop offset="0.6" stopColor="#C82D14" />
        <stop offset="1" stopColor="#8F1D0C" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * تصویرسازی برداری چندلایه و اشتهابرانگیز غذاها (ایزومتریک / ادیتوریال)
 */
export const DishArtwork: React.FC<{
  kind?: FoodVisualKind;
  clue?: string;
  size?: number;
  variant?: 'card' | 'thumb' | 'hero';
  className?: string;
}> = ({ kind, clue, size = 120, variant = 'card', className }) => {
  const resolvedKind = kind || resolveFoodKind(clue);
  const isHotDish =
    resolvedKind === 'pizza' ||
    resolvedKind === 'burger' ||
    resolvedKind === 'iranian' ||
    resolvedKind === 'sides' ||
    resolvedKind === 'chef';
  const combinedClassName = [
    variant !== 'thumb' ? 'foodino-dish-hero' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={combinedClassName}
      aria-hidden="true"
    >
      {/* سایه و بشقاب سرامیکی دست‌ساز */}
      {variant !== 'thumb' && (
        <>
          <ellipse cx="80" cy="134" rx="56" ry="12" fill="rgba(0,0,0,0.22)" />
          <circle
            cx="80"
            cy="82"
            r="62"
            fill="#FAF5EE"
            stroke="#E5DAC9"
            strokeWidth="3"
          />
          <circle
            cx="80"
            cy="82"
            r="50"
            fill="#F3ECE1"
            stroke="#E2D5C1"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </>
      )}

      {resolvedKind === 'pizza' && (
        <g>
          {/* خمیر ناپولیتن طلایی */}
          <circle cx="80" cy="82" r="48" fill="#D9822B" />
          <circle cx="80" cy="82" r="43" fill="#F2B249" />
          {/* سس گوجه سان مارزانو */}
          <circle cx="80" cy="82" r="39" fill="#C93318" />
          {/* پنیر موزارلای ذوب‌شده */}
          <path
            d="M80 46C99 46 115 61 116 80C117 99 101 117 81 117C61 117 45 101 45 81C45 62 61 46 80 46Z"
            fill="#FFF5D6"
          />
          {/* خطوط برش پیتزا */}
          <path
            d="M80 43V121M41 82H119M53 55L107 109M107 55L53 109"
            stroke="#E5C583"
            strokeWidth="1.6"
            opacity="0.7"
          />
          {/* پپرونی‌های تنوری */}
          <circle cx="66" cy="66" r="8" fill="#B82314" />
          <circle cx="64" cy="64" r="1.5" fill="#FCA5A5" />
          <circle cx="95" cy="67" r="8.5" fill="#B82314" />
          <circle cx="97" cy="65" r="1.5" fill="#FCA5A5" />
          <circle cx="65" cy="96" r="8" fill="#B82314" />
          <circle cx="63" cy="94" r="1.5" fill="#FCA5A5" />
          <circle cx="95" cy="95" r="8.5" fill="#B82314" />
          <circle cx="93" cy="97" r="1.5" fill="#FCA5A5" />
          <circle cx="80" cy="81" r="7" fill="#9E1C0F" />
          {/* برگ‌های ریحان تازه */}
          <path
            d="M78 58C78 58 84 52 89 56C93 60 86 67 80 64C77 62 78 58 78 58Z"
            fill="#15803D"
          />
          <path
            d="M71 84C71 84 63 86 63 92C63 97 72 95 74 89C75 86 71 84 71 84Z"
            fill="#16A34A"
          />
          <path
            d="M88 84C88 84 96 81 99 86C101 91 93 95 89 90C87 87 88 84 88 84Z"
            fill="#15803D"
          />
        </g>
      )}

      {resolvedKind === 'burger' && (
        <g>
          {/* سایه زیر برگر */}
          <ellipse cx="80" cy="115" rx="38" ry="8" fill="rgba(22,18,15,0.18)" />
          {/* نان پایین بریوش */}
          <path
            d="M44 101H116C116 108.5 109.5 114 101 114H59C50.5 114 44 108.5 44 101Z"
            fill="#D9822B"
          />
          {/* کاهوی تازه مواج */}
          <path
            d="M40 97C45 93 51 101 56 97C61 93 67 101 72 97C77 93 83 101 88 97C93 93 99 101 104 97C109 93 115 101 120 97"
            stroke="#22C55E"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* لایه گوشت گریل زغالی اول */}
          <rect x="42" y="85" width="76" height="12" rx="6" fill="#4A2511" />
          {/* پنیر چدار ذوب‌شده */}
          <path
            d="M44 85H116L108 93L98 86H86L76 95L66 86H44V85Z"
            fill="#FBBF24"
          />
          {/* لایه گوشت دوم + گوجه */}
          <rect x="44" y="74" width="72" height="11" rx="5.5" fill="#5C2E14" />
          <rect x="49" y="69" width="62" height="6" rx="3" fill="#DC2626" />
          {/* نان بالای بریوش */}
          <path
            d="M44 71C44 51.5 59.5 41 80 41C100.5 41 116 51.5 116 71H44Z"
            fill="url(#burger_bun_grad)"
          />
          {/* کنجدهای طلایی */}
          <ellipse cx="68" cy="53" rx="3" ry="1.6" transform="rotate(-15 68 53)" fill="#FFFBEB" />
          <ellipse cx="80" cy="49" rx="3" ry="1.6" fill="#FFFBEB" />
          <ellipse cx="92" cy="54" rx="3" ry="1.6" transform="rotate(18 92 54)" fill="#FFFBEB" />
          <ellipse cx="74" cy="60" rx="3" ry="1.6" transform="rotate(8 74 60)" fill="#FFFBEB" />
          <ellipse cx="87" cy="61" rx="3" ry="1.6" transform="rotate(-10 87 61)" fill="#FFFBEB" />
          <defs>
            <linearGradient id="burger_bun_grad" x1="80" y1="41" x2="80" y2="71" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop offset="1" stopColor="#C26A1B" />
            </linearGradient>
          </defs>
        </g>
      )}

      {resolvedKind === 'iranian' && (
        <g>
          {/* برنج ایرانی با تهچین و زعفران */}
          <ellipse cx="76" cy="74" rx="35" ry="24" fill="#FFFDF7" stroke="#E5DEC9" strokeWidth="1.5" />
          <ellipse cx="76" cy="71" rx="26" ry="15" fill="#FBBF24" opacity="0.88" />
          <circle cx="71" cy="69" r="2" fill="#B91C1C" />
          <circle cx="78" cy="67" r="2.2" fill="#DC2626" />
          <circle cx="82" cy="72" r="1.8" fill="#B91C1C" />
          <circle cx="74" cy="74" r="1.8" fill="#15803D" />
          {/* سیخ کباب کوبیده/برگ زعفرانی */}
          <rect x="42" y="88" width="76" height="11" rx="5.5" fill="#592816" />
          <path d="M52 88V99M64 88V99M76 88V99M88 88V99M100 88V99" stroke="#3B180C" strokeWidth="2.2" />
          {/* سیخ جوجه کباب زعفرانی */}
          <rect x="46" y="101" width="68" height="10" rx="5" fill="#E59A11" />
          <path d="M56 101V111M70 101V111M84 101V111M98 101V111" stroke="#B45309" strokeWidth="2" />
          {/* گوجه‌فرنگی کبابی و لیمو و ریحان */}
          <circle cx="107" cy="68" r="9.5" fill="#D9381E" />
          <circle cx="105" cy="66" r="3" fill="#431407" opacity="0.55" />
          <circle cx="52" cy="73" r="8" fill="#15803D" />
          <circle cx="55" cy="76" r="6" fill="#22C55E" />
        </g>
      )}

      {resolvedKind === 'sushi' && (
        <g>
          {/* تخته سنگی سوشی */}
          <rect x="38" y="54" width="84" height="56" rx="12" fill="#1E293B" stroke="#334155" strokeWidth="2" />
          {/* چاپستیک چوبی */}
          <path d="M34 45L124 62" stroke="#D97706" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M34 51L124 66" stroke="#B45309" strokeWidth="3.5" strokeLinecap="round" />
          {/* رول ماکی اول */}
          <circle cx="62" cy="82" r="15" fill="#0F172A" />
          <circle cx="62" cy="82" r="12" fill="#FFFDF9" />
          <circle cx="59" cy="80" r="5" fill="#FB7185" />
          <circle cx="66" cy="84" r="4" fill="#22C55E" />
          {/* رول ماکی دوم */}
          <circle cx="96" cy="82" r="15" fill="#0F172A" />
          <circle cx="96" cy="82" r="12" fill="#FFFDF9" />
          <circle cx="93" cy="80" r="5" fill="#F97316" />
          <circle cx="100" cy="84" r="4" fill="#FACC15" />
          {/* نیگیری سالمون */}
          <rect x="66" y="96" width="28" height="11" rx="5.5" fill="#FB7185" />
          <path d="M72 96L76 107M80 96L84 107M88 96L91 107" stroke="#FFE4E6" strokeWidth="1.5" />
          <rect x="77" y="95" width="6" height="12" fill="#0F172A" />
          {/* برگ واسابی */}
          <circle cx="111" cy="98" r="5.5" fill="#4ADE80" />
        </g>
      )}

      {resolvedKind === 'salad' && (
        <g>
          {/* کاسه چوبی/سرامیکی سالاد */}
          <circle cx="80" cy="82" r="44" fill="#14532D" />
          <circle cx="80" cy="82" r="39" fill="#166534" />
          {/* برگ‌های اسفناج و کاهو */}
          <circle cx="66" cy="70" r="14" fill="#22C55E" />
          <circle cx="94" cy="72" r="13" fill="#4ADE80" />
          <circle cx="76" cy="94" r="15" fill="#16A34A" />
          {/* برش‌های آووکادو */}
          <path d="M56 84C56 75 65 72 71 78C77 84 71 95 62 93C57 92 56 84 56 84Z" fill="#86EFAC" />
          <circle cx="64" cy="84" r="4.5" fill="#78350F" />
          {/* گوجه گیلاسی */}
          <circle cx="93" cy="64" r="7" fill="#EF4444" />
          <circle cx="91" cy="62" r="2" fill="#FCA5A5" />
          <circle cx="98" cy="91" r="6.5" fill="#DC2626" />
          {/* کروتان و پنیر پارمزان و کینوا */}
          <rect x="74" y="62" width="9" height="9" rx="2.5" transform="rotate(15 74 62)" fill="#FBBF24" />
          <rect x="81" y="79" width="9" height="9" rx="2.5" transform="rotate(-12 81 79)" fill="#F59E0B" />
          <circle cx="74" cy="94" r="3" fill="#FFFBEB" />
          <circle cx="86" cy="96" r="2.5" fill="#FFFBEB" />
        </g>
      )}

      {resolvedKind === 'sides' && (
        <g>
          {/* خلال‌های سیب‌زمینی طلایی */}
          <rect x="57" y="44" width="8" height="42" rx="4" transform="rotate(-10 57 44)" fill="#FBBF24" />
          <rect x="68" y="40" width="8" height="46" rx="4" transform="rotate(-3 68 40)" fill="#F59E0B" />
          <rect x="79" y="38" width="8.5" height="48" rx="4" fill="#FCD34D" />
          <rect x="90" y="41" width="8" height="45" rx="4" transform="rotate(5 90 41)" fill="#F59E0B" />
          <rect x="100" y="46" width="8" height="40" rx="4" transform="rotate(12 100 46)" fill="#D97706" />
          {/* پاکت کرافت دست‌ساز */}
          <path
            d="M52 72H108L101 114C100.5 117 98 119 95 119H65C62 119 59.5 117 59 114L52 72Z"
            fill="#D9381E"
          />
          <path
            d="M60 72C65 78 72 81 80 81C88 81 95 78 100 72H60Z"
            fill="#B82B14"
          />
          <circle cx="80" cy="97" r="9" fill="#FFFBEB" />
          <circle cx="80" cy="97" r="5" fill="#D9381E" />
        </g>
      )}

      {resolvedKind === 'drink' && (
        <g>
          {/* نی نوشیدنی */}
          <path d="M88 36L78 60" stroke="#D9381E" strokeWidth="5" strokeLinecap="round" />
          {/* لیوان بلوری */}
          <path
            d="M54 56H106L99 114C98.5 117.5 95.5 120 92 120H68C64.5 120 61.5 117.5 61 114L54 56Z"
            fill="#E0F2FE"
            stroke="#BAE6FD"
            strokeWidth="2.5"
          />
          {/* مایع موهیتو / لیموناد */}
          <path
            d="M57 68H103L97.5 112C97 115 94.5 117 91.5 117H68.5C65.5 117 63 115 62.5 112L57 68Z"
            fill="url(#drink_grad)"
          />
          {/* برش لیمو و برگ نعناع */}
          <circle cx="86" cy="82" r="10" fill="#FDE047" stroke="#FEF9C3" strokeWidth="2" />
          <path d="M65 78C65 72 73 70 76 76C78 81 71 86 66 82Z" fill="#16A34A" />
          <rect x="68" y="92" width="10" height="10" rx="3" fill="rgba(255,255,255,0.65)" />
          <rect x="82" y="97" width="9" height="9" rx="2.5" fill="rgba(255,255,255,0.55)" />
          <defs>
            <linearGradient id="drink_grad" x1="80" y1="68" x2="80" y2="117" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34D399" />
              <stop offset="1" stopColor="#059669" />
            </linearGradient>
          </defs>
        </g>
      )}

      {resolvedKind === 'chef' && (
        <g>
          {/* سرپوش طلایی سرآشپز */}
          <path
            d="M44 96C44 76.1177 60.1177 60 80 60C99.8823 60 116 76.1177 116 96H44Z"
            fill="url(#chef_cloche_grad)"
          />
          <circle cx="80" cy="55" r="5.5" fill="#D9381E" />
          <rect x="38" y="96" width="84" height="7" rx="3.5" fill="#78350F" />
          <path
            d="M56 76C61 68 69 65 78 65"
            stroke="#FFFBEB"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.7"
          />
          <defs>
            <linearGradient id="chef_cloche_grad" x1="80" y1="60" x2="80" y2="96" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FBBF24" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>
          </defs>
        </g>
      )}

      {/* بخار گرم متحرک برای غذاهای داغ و درخشش تازگی برای غذاهای سرد */}
      {variant !== 'thumb' && isHotDish && (
        <g pointerEvents="none">
          <path
            className="foodino-steam-1"
            d="M64 34C61 28 67 23 64 17"
            stroke="rgba(255, 250, 240, 0.65)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            className="foodino-steam-2"
            d="M80 30C77 24 83 19 80 12"
            stroke="rgba(255, 250, 240, 0.75)"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            className="foodino-steam-3"
            d="M96 35C93 29 99 24 96 18"
            stroke="rgba(255, 250, 240, 0.6)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </g>
      )}

      {variant !== 'thumb' && !isHotDish && (
        <g pointerEvents="none">
          <circle
            className="foodino-steam-1"
            cx="54"
            cy="34"
            r="3"
            fill="rgba(253, 230, 138, 0.85)"
          />
          <circle
            className="foodino-steam-2"
            cx="106"
            cy="30"
            r="2.5"
            fill="rgba(253, 230, 138, 0.75)"
          />
        </g>
      )}
    </svg>
  );
};

/* ============================================================================
 * آیکون‌های برداری یکپارچه، دقیق و بدون ایموجی
 * ========================================================================== */

export const StarIcon: React.FC<IconProps & { filled?: boolean }> = ({
  size = 16,
  filled = true,
  className,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={filled ? '1' : '2'}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ size = 16, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9.5" />
    <polyline points="12 7 12 12 15.5 14" />
  </svg>
);

export const CourierIcon: React.FC<IconProps> = ({ size = 16, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <circle cx="6.5" cy="17.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
    <path d="M9 17.5h6" />
    <path d="M4 17.5H3v-5l2.5-4.5h5.5v4.5h3.5l2.5 5" />
    <path d="M14 5h3l2 4" />
  </svg>
);

export const FlameIcon: React.FC<IconProps> = ({ size = 16, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path d="M12.5 2C12.5 2 18 6.5 18 12.5C18 16.6421 14.6421 20 10.5 20C6.9 20 4 17.1 4 13.5C4 10.5 6 7.8 7.5 6.5C7.5 6.5 7 9.5 9.5 10.5C8.5 7 10.5 3.8 12.5 2Z" />
  </svg>
);

export const SparkleIcon: React.FC<IconProps> = ({ size = 16, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path d="M12 2L14.6 9.4L22 12L14.6 14.6L12 22L9.4 14.6L2 12L9.4 9.4L12 2Z" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7.5" />
    <line x1="20" y1="20" x2="16.35" y2="16.35" />
  </svg>
);

export const HeartIcon: React.FC<IconProps & { filled?: boolean }> = ({
  size = 18,
  filled = false,
  className,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const BagIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const MapPinIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const PhoneIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const MailIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9.5" />
    <path d="m8.5 12.5 2.3 2.3 4.7-4.8" />
  </svg>
);

export const AlertCircleIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9.5" />
    <line x1="12" y1="8" x2="12" y2="12.5" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export const InfoIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9.5" />
    <line x1="12" y1="16" x2="12" y2="11.5" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ size = 16, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ size = 16, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const MinusIcon: React.FC<IconProps> = ({ size = 16, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ size = 16, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ size = 16, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ size = 16, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const UtensilsIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
);

export const StoreIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
    <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
  </svg>
);

export const TagIcon: React.FC<IconProps> = ({ size = 16, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

export const WalletIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
    <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
  </svg>
);

export const CopyIcon: React.FC<IconProps> = ({ size = 16, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export const EyeIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeOffIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export const MenuIcon: React.FC<IconProps> = ({ size = 22, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="8" y1="17" x2="20" y2="17" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const TrackRadarIcon: React.FC<IconProps> = ({ size = 20, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="3" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="21" />
    <line x1="3" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="21" y2="12" />
  </svg>
);

export const GithubIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
  </svg>
);

export const LinkedinIcon: React.FC<IconProps> = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
  </svg>
);
