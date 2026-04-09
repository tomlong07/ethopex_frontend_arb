<script setup lang="ts">
import 'vue-json-pretty/lib/styles.css'

import VueJsonPretty from 'vue-json-pretty'
import CopyOutline from '@/assets/icons/CopyOutline.vue'

const formattedJson = {
  taxonomy_version: '2.1',
  last_updated: '2026-01-13',
  description:
    'Master Compliance Taxonomy with Nuanced Instructions & Few-Shot Examples. All rules include complete metadata (category, severity, description) and comprehensive few-shot examples for RAG retrieval.',
  rules: [
    {
      id: 'FALSE_001_SPECIFIC_DISCOUNT',
      category: 'FALSE_INFORMATION',
      name: 'Specific Price/Discount Promise (Realis Mood)',
      description:
        'Promising specific price drops, percentages, or numbers without control.',
      severity: 'HIGH',
      conditions: {
        apply_to_intents: ['ALL'],
        exception_logic: 'SUBJUNCTIVE_MOOD',
      },
      prompt_instruction:
        "Analyze all available text (Ad Copy, OCR) and Audio. Flag statements using 'Realis Mood' (statements of fact like 'Prices ARE down 40%', 'You WILL save $500'). \n\nEXCEPTIONS (PASS these):\n1. Subjunctive Mood ('Might be cheaper', 'COULD save you money', 'Prices MAY vary').\n2. Range Qualifiers ('Up to 50%', 'Prices from $10', 'As low as').\n3. Estimates ('Around $100').",
      trigger_keywords: ['%', 'price down', 'cost', 'deal', 'save', 'free'],
      few_shot_examples: [
        {
          content: "Last year's SUV prices are down 40%.",
          label: 'REJECT',
          reason: 'Specific percentage claim not guaranteed.',
        },
        {
          content: 'Ever wondered about discounts? They might surprise you.',
          label: 'PASS',
          reason: "Uses subjunctive mood ('might').",
        },
        {
          content: 'Get a free laptop today!',
          label: 'REJECT',
          reason: 'Specific item promise not guaranteed on landing page.',
        },
        {
          content: 'Save up to 50%.',
          label: 'PASS',
          reason: "Range qualifier ('Up to').",
        },
        {
          content: 'Prices might start at $10.',
          label: 'PASS',
          reason: 'Subjunctive mood.',
        },
        {
          content: 'You will save $500 today.',
          label: 'REJECT',
          reason: 'Guaranteed savings promise.',
        },
        {
          content: 'Deals could be available near you.',
          label: 'PASS',
          reason: 'Possibility, not assertion.',
        },
      ],
    },
    {
      id: 'FALSE_002_UNFULFILLABLE_PROMISE',
      category: 'FALSE_INFORMATION',
      name: 'Unfulfillable Expectations',
      description:
        'Claims about government forgiveness, instant jobs, or guaranteed success.',
      severity: 'CRITICAL',
      conditions: { apply_to_intents: ['ALL'] },
      prompt_instruction:
        "Reject claims in Ad Copy, OCR, or Audio that imply outcomes outside the advertiser's control, such as 'Loan Forgiveness' (Government act), 'Instant Job Placement', or 'Guaranteed Approval', 'No Credit Check'.",
      trigger_keywords: [
        'forgive',
        'instant',
        'guaranteed',
        'no credit check',
        '100%',
      ],
      few_shot_examples: [
        {
          content: 'Government will forgive all student loans.',
          label: 'REJECT',
          reason: 'Claims government action.',
        },
        {
          content: 'Guaranteed approval in 24 hours.',
          label: 'REJECT',
          reason: 'Outcome outside advertiser control.',
        },
        {
          content: 'No credit check required.',
          label: 'REJECT',
          reason: 'Absolute financial claim.',
        },
        {
          content: 'Instant job placement after signup.',
          label: 'REJECT',
          reason: 'Unverifiable employment guarantee.',
        },
        {
          content: 'Explore potential loan relief programs.',
          label: 'PASS',
          reason: 'Informational, non-guaranteed.',
        },
        {
          content: 'See if you may qualify.',
          label: 'PASS',
          reason: 'Conditional phrasing.',
        },
        {
          content: 'Learn about hiring trends.',
          label: 'PASS',
          reason: 'General information.',
        },
      ],
    },
    {
      id: 'FALSE_003_MODAL_CONFLICT',
      category: 'FALSE_INFORMATION',
      name: 'Audio/Visual Contradiction',
      description:
        'Information in the image/audio contradicts the text to mislead.',
      severity: 'MEDIUM',
      conditions: { apply_to_intents: ['ALL'] },
      prompt_instruction:
        "Check for contradictions between available streams (Ad Copy vs Image vs Audio). Example: Visual shows a specific price '$9.99' but text says 'Prices vary'. Audio says 'Free' but OCR says 'Subscription required'.",
      trigger_keywords: ['free', 'price', 'cost', 'subscription', 'payment'],
      few_shot_examples: [
        {
          content: "[Audio]: 'Everything is free', [OCR]: 'Plans from $19/mo'",
          label: 'REJECT',
          reason: 'Direct contradiction.',
        },
        {
          content: "[Visual]: '$9.99', [Text]: 'Prices vary'",
          label: 'REJECT',
          reason: 'Conflicting price certainty.',
        },
        {
          content: "[Audio]: 'No signup required', [OCR]: 'Create an account'",
          label: 'REJECT',
          reason: 'Contradictory requirements.',
        },
        {
          content: "[Visual]: 'Free Trial', [OCR]: 'Credit card required'",
          label: 'REJECT',
          reason: 'Hidden condition conflict.',
        },
        {
          content: "[Visual & Text]: 'Free Trial Available'",
          label: 'PASS',
          reason: 'Consistent messaging.',
        },
        {
          content: "[Audio & OCR]: 'Prices may vary'",
          label: 'PASS',
          reason: 'Aligned uncertainty.',
        },
        {
          content: '[Image]: Product photo only',
          label: 'PASS',
          reason: 'No conflicting claims.',
        },
        {
          content: "[Text Only]: 'Get the best deal today'",
          label: 'PASS',
          reason: 'Single modality, no conflict possible.',
        },
      ],
    },
    {
      id: 'CTA_001_TRANSACTIONAL_MISMATCH',
      category: 'INTENT',
      name: 'Transactional CTA on Info Page',
      description:
        "Using 'Buy/Apply' CTAs when the user expects a Guide/Article.",
      severity: 'HIGH',
      conditions: {
        apply_to_intents: ['INFORMATIONAL', 'LEAD_GEN'],
        skip_if_intent: ['PURCHASE', 'SHOPPING', 'CONVERT'],
      },
      prompt_instruction:
        "If Campaign Goal is INFORMATIONAL: Reject transactional verbs (Buy, Book, Apply, Shop, Get) in OCR/Audio. \n\nNUANCE: 'Meta-CTAs' that refer to the *article content* (e.g., 'Read about Sales', 'Discover Job Options', 'See Offers') are ALLOWED. Reject only if it implies the user performs the transaction immediately on the next page.",
      trigger_keywords: [
        'apply',
        'buy',
        'shop',
        'book',
        'reserve',
        'start trial',
      ],
      few_shot_examples: [
        {
          content: 'Apply Now',
          label: 'REJECT',
          reason: 'Transactional CTA for info context.',
        },
        {
          content: 'See Options',
          label: 'PASS',
          reason: 'Exploratory/Informational CTA.',
        },
        {
          content: 'Book an appointment',
          label: 'REJECT',
          reason: 'Implies immediate booking capability.',
        },
        {
          content: 'Find out more about dental implants',
          label: 'PASS',
          reason: 'Refers to learning information.',
        },
        {
          content: 'Start your trial',
          label: 'REJECT',
          reason: 'Conversion-focused CTA.',
        },
        {
          content: 'Learn more about treatment options',
          label: 'PASS',
          reason: 'Educational CTA.',
        },
        {
          content: 'See available programs',
          label: 'PASS',
          reason: 'Exploratory language.',
        },
        {
          content: 'Read the full guide',
          label: 'PASS',
          reason: 'Content-focused CTA.',
        },
      ],
    },
    {
      id: 'CTA_002_FALSE_URGENCY',
      category: 'FALSE_INFORMATION',
      name: 'Artificial Scarcity',
      description:
        'Creating fake pressure through countdown timers, limited spots claims, or artificial deadlines.',
      severity: 'MEDIUM',
      conditions: { apply_to_intents: ['ALL'] },
      prompt_instruction:
        "Flag artificial limits: 'Timer ending', '3 spots left', 'Expires in 5 mins'. \n\nEXCEPTION: Natural Seasonality ('Winter Sale', 'Black Friday Deal', 'Limited Edition') is ALLOWED.",
      trigger_keywords: [
        'hurry',
        'limited time',
        'last chance',
        'expires',
        'timer',
        'spots left',
      ],
      few_shot_examples: [
        {
          content: 'Offer expires in 5 minutes!',
          label: 'REJECT',
          reason: 'Artificial urgency.',
        },
        {
          content: 'Seasonal offers available.',
          label: 'PASS',
          reason: 'Natural time relevance.',
        },
        {
          content: 'Only 3 spots left!',
          label: 'REJECT',
          reason: 'Artificial scarcity.',
        },
        {
          content: 'Last chance today!',
          label: 'REJECT',
          reason: 'Urgency without proof.',
        },
        {
          content: "Hurry before it's gone!",
          label: 'REJECT',
          reason: 'Pressure language.',
        },
        {
          content: 'Winter sale now live',
          label: 'PASS',
          reason: 'Seasonal event.',
        },
        {
          content: 'Black Friday deals',
          label: 'PASS',
          reason: 'Recognized sales period.',
        },
        {
          content: 'Limited edition release',
          label: 'PASS',
          reason: 'Product-based limitation.',
        },
      ],
    },
    {
      id: 'ALIGN_001_RELEVANCE',
      category: 'ALIGNMENT',
      name: 'Landing Page/Topic Relevance',
      description:
        'Checks basic topical relevance between visual and campaign topic, regardless of intent or persuasion.',
      severity: 'MEDIUM',
      conditions: { apply_to_intents: ['ALL'] },
      prompt_instruction:
        "Does the main subject of the image/video/text relate to the Campaign Product: '{{product_name}}'? \n\nRSOC EXCEPTION: Avoid using unrelated visuals (e.g., a Banana for Arthritis treatment).",
      trigger_keywords: ['relevance', 'topic', 'subject matter'],
      few_shot_examples: [
        {
          content: '[Image: Banana], Product: Arthritis Cream',
          label: 'REJECT',
          reason: 'No topical relevance.',
        },
        {
          content: '[Image: Mountain landscape], Product: Accounting Software',
          label: 'REJECT',
          reason: 'Irrelevant imagery.',
        },
        {
          content: '[Image: Puppy], Product: VPN Service',
          label: 'REJECT',
          reason: 'Unrelated subject.',
        },
        {
          content: '[Image: Doctor examining knee], Product: Arthritis Cream',
          label: 'PASS',
          reason: 'Direct relevance.',
        },
        {
          content: '[Image: App dashboard], Product: Budget App',
          label: 'PASS',
          reason: 'Product shown.',
        },
        {
          content: '[Image: Laptop with code], Product: Coding Course',
          label: 'PASS',
          reason: 'Contextually aligned.',
        },
        {
          content: '[Image: Warehouse shelves], Product: Inventory Software',
          label: 'PASS',
          reason: 'Relevant environment.',
        },
        {
          content: "[Text]: 'Win a free iPhone', Product: Mortgage Loans",
          label: 'REJECT',
          reason: 'Irrelevant clickbait.',
        },
      ],
    },
    {
      id: 'VISUAL_001_FAKE_UI',
      category: 'VISUAL_DECEPTION',
      name: 'Deceptive UI Elements',
      description:
        'Visual elements mimicking site functionality to trick clicks.',
      severity: 'MEDIUM',
      conditions: { apply_to_intents: ['ALL'] },
      prompt_instruction:
        "Identify DECEPTIVE UI elements meant to trick a click:\n1. Fake 'Play Buttons' on static images.\n2. Fake 'Close (X)' buttons.\n3. Fake 'Notification Badges' (Red dots).\n4. Fake 'Carousel Dots' (implying swipe). \n\nDISTINCTION LOGIC:\n1. PASS: Standard CTA buttons ('Learn More', 'Shop Now', 'Download') are ALLOWED as decorative elements.\n2. PASS: Screenshots of software/interfaces (e.g. YouTube screen, Dashboard) used for ILLUSTRATION purposes.\n3. REJECT: 'Fake Play Buttons' overlays on static images meant to look like a playable video player.\n4. REJECT: Fake system notifications (red badges, '1 new message'), fake close 'X' buttons, or fake toggle switches.",
      trigger_keywords: [
        'play button',
        'close button',
        'notification',
        'badge',
        'carousel',
      ],
      few_shot_examples: [
        {
          content:
            '[Image: Static image with a big Play Button in center], Intent: Clickbait',
          label: 'REJECT',
          reason:
            'Fake Play Button implies video functionality on static image.',
        },
        {
          content: "[Image: A button graphic saying 'Shop Now'], Intent: Sales",
          label: 'PASS',
          reason: 'Decorative CTA button is allowed.',
        },
        {
          content:
            '[Image: Screenshot of YouTube Channel layout], Intent: Course',
          label: 'PASS',
          reason: 'Illustrative screenshot of a platform.',
        },
        {
          content: "[Image: Fake 'X' close button]",
          label: 'REJECT',
          reason: 'Imitates dismissible UI.',
        },
        {
          content: "[Image: Red notification badge '1']",
          label: 'REJECT',
          reason: 'Fake system alert.',
        },
        {
          content: '[Image: Toggle switch graphic]',
          label: 'REJECT',
          reason: 'Implied interactivity.',
        },
        {
          content: "[Image: Decorative 'Learn More' button]",
          label: 'PASS',
          reason: 'Standard CTA.',
        },
        {
          content: "[Image: App UI mockup labeled 'Example']",
          label: 'PASS',
          reason: 'Non-deceptive illustration.',
        },
        {
          content: "[Text Only]: 'Click here to play'",
          label: 'PASS',
          reason: 'Text instruction is not a fake UI element.',
        },
      ],
    },
    {
      id: 'VISUAL_002_CONTEXT_DISCONNECT',
      category: 'VISUAL_DECEPTION',
      name: 'Visual-Product Disconnect / Fake News',
      description:
        'Detects manipulative or deceptive use of visuals, including fake news or false authority framing.',
      severity: 'LOW',
      conditions: { apply_to_intents: ['ALL'] },
      prompt_instruction:
        "1. Does image relate to Product: '{{product_name}}'? \n2. Does image mimic a 'Breaking News' broadcast to sell a product? (Fake News Format). \nIf yes to #2 or No to #1 -> Reject.\n\nNOTE: If input is Text-Only, this rule is PASS.",
      trigger_keywords: ['news', 'breaking', 'alert', 'broadcast', 'authority'],
      few_shot_examples: [
        {
          content:
            '[Image: Random stock photo of people shaking hands], Product: Herbal hair loss serum',
          label: 'REJECT',
          reason: 'Generic image unrelated to product use or outcome.',
        },
        {
          content:
            "[Image: CNN Anchor style saying 'Miracle Cure'], Product: Diet Pill",
          label: 'REJECT',
          reason: 'Fake News format.',
        },
        {
          content:
            '[Image: Brain illustration with glowing neurons], Product: Energy drink',
          label: 'REJECT',
          reason:
            'Symbolic imagery implies cognitive effects without product relevance.',
        },
        {
          content:
            "[Image: Emergency banner 'Public Health Alert'], Product: Sleep supplement",
          label: 'REJECT',
          reason: 'Fake emergency framing to market product.',
        },
        {
          content:
            '[Image: Person drinking energy drink], Product: Energy Drink',
          label: 'PASS',
          reason: 'Direct usage context.',
        },
        {
          content: '[Image: Supplement bottle on table], Product: Supplement',
          label: 'PASS',
          reason: 'Product shown.',
        },
        {
          content: '[Image: Athlete running], Product: Sports Shoes',
          label: 'PASS',
          reason: 'Contextually relevant.',
        },
      ],
    },
    {
      id: 'INTENT_001_INTERACTIVE_MISMATCH',
      category: 'INTENT',
      name: 'Utility/Interactive Element Mismatch',
      description:
        'Promoting a utility (tool, calculator) on a static info page.',
      severity: 'MEDIUM',
      conditions: { apply_to_intents: ['INFORMATIONAL'] },
      prompt_instruction:
        'Flag if the creative promotes a functional tool (Calculator, Scanner, Locator). \n\nEXCEPTION: QR Codes displayed on screen are ALLOWED if they lead to the article content.',
      trigger_keywords: [
        'calculator',
        'tool',
        'scanner',
        'locator',
        'finder',
        'interactive',
      ],
      few_shot_examples: [
        {
          content: '[Image: Calculator UI], Text: Calculate your mortgage',
          label: 'REJECT',
          reason: 'Implies interactive tool on static page.',
        },
        {
          content:
            '[Image: QR Code next to headline], Text: Open the detailed guide',
          label: 'PASS',
          reason: 'Navigation-only QR code.',
        },
        {
          content:
            '[Image: Loan calculator with sliders], Text: Adjust values to see your loan',
          label: 'REJECT',
          reason: 'Requires user interaction not supported on static content.',
        },
        {
          content: '[Image: GPS map with pin], Text: Find nearby clinics now',
          label: 'REJECT',
          reason: 'Locator tool implied but page is informational.',
        },
        {
          content:
            '[Image: Dashboard-style UI], Text: Our tool helps you calculate ROI',
          label: 'REJECT',
          reason: 'Tool promotion embedded in informational framing.',
        },
        {
          content:
            '[Image: Screenshot of map with labels], Text: How clinic locator tools work',
          label: 'PASS',
          reason: 'Descriptive, not offering tool usage.',
        },
        {
          content:
            '[Image: Calculator icon], Text: Understanding how loan calculators work',
          label: 'PASS',
          reason: 'Iconic reference without interaction promise.',
        },
        {
          content: "[Text]: 'Calculate your mortgage now'",
          label: 'REJECT',
          reason: 'Implies interactive tool on static page.',
        },
      ],
    },
    {
      id: 'MISREP_001_IDENTITY',
      category: 'MISREPRESENTATION',
      name: 'Misleading Identity (First Person)',
      description: "Using 'Our/We' when you are a third party.",
      severity: 'HIGH',
      conditions: { apply_to_intents: ['ALL'] },
      prompt_instruction:
        "Reject 'Our/We/Us' in Ad Copy/OCR if it implies ownership of a product/service the advertiser does not own (e.g. Traffic Source/Affiliate). \n\nEXCEPTION: \n 1. If the `product_name` implies an Official Brand Campaign, this is allowed. \n 2. Personal Testimonials ('I used this...', 'My experience...') are ALLOWED.",
      trigger_keywords: ['our', 'we', 'us', 'my', 'I'],
      few_shot_examples: [
        {
          content: 'We are hiring now!',
          label: 'REJECT',
          reason: 'Third-party implying ownership.',
        },
        {
          content: 'Our loan program approves everyone.',
          label: 'REJECT',
          reason: 'False first-person authority.',
        },
        {
          content: 'Apply to our company today.',
          label: 'REJECT',
          reason: 'Misrepresented employer.',
        },
        {
          content: 'I used this service myself.',
          label: 'PASS',
          reason: 'Personal testimonial.',
        },
        {
          content: 'Companies are hiring nationwide.',
          label: 'PASS',
          reason: 'Neutral phrasing.',
        },
        {
          content: 'This platform connects job seekers.',
          label: 'PASS',
          reason: 'Clear intermediary role.',
        },
        {
          content: 'Learn about employer requirements.',
          label: 'PASS',
          reason: 'Informational.',
        },
      ],
    },
    {
      id: 'PROHIB_001_ADULT',
      category: 'PROHIBITED',
      name: 'Adult/Suggestive Content',
      description:
        'Any nudity, visible genitals, sexually suggestive images/texts, or provocative poses that violate platform content policies.\n\nNOTE: If Text-Only, check for explicit sexual language.',
      severity: 'CRITICAL',
      conditions: { apply_to_intents: ['ALL'] },
      prompt_instruction:
        'Strictly reject any nudity, visible genitals, sexually suggestive images, or provocative poses.',
      trigger_keywords: [
        'nudity',
        'sexual',
        'explicit',
        'provocative',
        'adult',
      ],
      few_shot_examples: [
        {
          content: '[Image: Partial nudity visible]',
          label: 'REJECT',
          reason: 'Explicit content violation.',
        },
        {
          content: '[Image: Suggestive pose in lingerie]',
          label: 'REJECT',
          reason: 'Sexually suggestive imagery.',
        },
        {
          content: '[Image: Provocative camera angle]',
          label: 'REJECT',
          reason: 'Inappropriate framing.',
        },
        {
          content: '[Image: Person in business attire]',
          label: 'PASS',
          reason: 'Professional, non-suggestive.',
        },
        {
          content: '[Image: Fitness model in workout clothes]',
          label: 'PASS',
          reason: 'Contextually appropriate athletic wear.',
        },
        {
          content: '[Image: Family at beach in swimwear]',
          label: 'PASS',
          reason: 'Non-suggestive, contextually normal.',
        },
        {
          content: '[Image: Medical diagram of anatomy]',
          label: 'PASS',
          reason: 'Educational context.',
        },
      ],
    },
    {
      id: 'PROHIB_002_ALCOHOL',
      category: 'PROHIBITED',
      name: 'Alcohol Promotion',
      description:
        'Visual or textual reference to alcoholic products (beer, wine, spirits) or drinking imagery that violates platform advertising policies.',
      severity: 'CRITICAL',
      conditions: { apply_to_intents: ['ALL'] },
      prompt_instruction:
        'Reject any visual or textual reference to alcoholic products (beer, wine, spirits) or drinking imagery.',
      trigger_keywords: [
        'beer',
        'wine',
        'alcohol',
        'vodka',
        'whiskey',
        'cocktail',
        'bar',
      ],
      few_shot_examples: [
        {
          content: '[Image: Beer bottles displayed]',
          label: 'REJECT',
          reason: 'Direct alcohol product shown.',
        },
        {
          content: '[Image: Wine glass with red wine]',
          label: 'REJECT',
          reason: 'Alcoholic beverage visible.',
        },
        {
          content: '[Image: Bar scene with cocktails]',
          label: 'REJECT',
          reason: 'Drinking imagery.',
        },
        {
          content: "[Text: 'Premium vodka sale']",
          label: 'REJECT',
          reason: 'Explicit alcohol promotion.',
        },
        {
          content: '[Image: Restaurant dining scene]',
          label: 'PASS',
          reason: 'No alcohol focus.',
        },
        {
          content: '[Image: Juice bottles]',
          label: 'PASS',
          reason: 'Non-alcoholic beverages.',
        },
        {
          content: '[Image: Kitchen with glassware]',
          label: 'PASS',
          reason: 'Generic household items.',
        },
      ],
    },
    {
      id: 'PROHIB_003_ILLEGAL',
      category: 'PROHIBITED',
      name: 'Illegal Products/Services',
      description:
        'Content implying or promoting anything illegal including drugs, counterfeits, weapons, or services that violate local laws.',
      severity: 'CRITICAL',
      conditions: { apply_to_intents: ['ALL'] },
      prompt_instruction:
        'Reject content implying or promoting anything illegal (drugs, counterfeits, weapons).',
      trigger_keywords: [
        'drugs',
        'counterfeit',
        'fake',
        'weapon',
        'illegal',
        'unlicensed',
      ],
      few_shot_examples: [
        {
          content: "[Text: 'Buy prescription drugs without prescription']",
          label: 'REJECT',
          reason: 'Illegal pharmaceutical sale.',
        },
        {
          content: '[Image: Counterfeit luxury bags]',
          label: 'REJECT',
          reason: 'Counterfeit goods promotion.',
        },
        {
          content: "[Text: 'Unlicensed firearms available']",
          label: 'REJECT',
          reason: 'Illegal weapons sale.',
        },
        {
          content: '[Image: Cannabis products in non-legal market]',
          label: 'REJECT',
          reason: 'Illegal drug promotion.',
        },
        {
          content: '[Image: Licensed pharmacy storefront]',
          label: 'PASS',
          reason: 'Legal healthcare provider.',
        },
        {
          content: '[Image: Authentic brand product with verification]',
          label: 'PASS',
          reason: 'Legitimate product.',
        },
        {
          content: "[Text: 'Consult your doctor for prescription']",
          label: 'PASS',
          reason: 'Legal medical advice.',
        },
      ],
    },
  ],
}

const copyJson = () => {
  const textToCopy =
    typeof formattedJson === 'object'
      ? JSON.stringify(formattedJson, null, 2)
      : String(formattedJson)

  helper.copyText(textToCopy)
  window.message.success(`Copied!`)
}
</script>

<template>
  <div class="sticky top-0 text-end py-2 ml-auto z-10">
    <button @click="copyJson">
      <n-icon :component="CopyOutline" size="18" />
    </button>
  </div>
  <vue-json-pretty
    :indent="8"
    class="whitespace-pre"
    showIcon
    :showLine="false"
    :show-double-quotes="true"
    :data="formattedJson"
  />
</template>

<style scoped>
:deep(.vjs-value-string) {
  color: #4e9a06 !important;
}
:deep(.vjs-tree) {
  font-family: inherit;
}
</style>

<style scoped>
.gutter {
  text-align: right;
  opacity: 0.6;
  user-select: none;
}
:deep(.vjs-tree) {
  white-space: pre-wrap;
}
:deep(.vjs-tree-node) {
  flex-wrap: wrap;
}
</style>
