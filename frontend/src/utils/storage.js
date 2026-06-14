const USER_KEY = 'ideavalidator_user';
const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const COMPETITORS_BY_INDUSTRY = {
  EdTech: [
    { name: 'Khan Academy', type: 'Direct', pricing: 'Free / Premium $7/mo', threat: 'High', color: 'bg-red-50 text-red-700 border-red-200' },
    { name: 'Coursera', type: 'Direct', pricing: '$49/mo subscription', threat: 'High', color: 'bg-red-50 text-red-700 border-red-200' },
    { name: 'Duolingo', type: 'Indirect', pricing: 'Freemium', threat: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { name: 'Chegg', type: 'Indirect', pricing: '$14.95/mo', threat: 'Low', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  ],
  FinTech: [
    { name: 'Stripe', type: 'Direct', pricing: '2.9% + 30¢ per txn', threat: 'High', color: 'bg-red-50 text-red-700 border-red-200' },
    { name: 'PayPal', type: 'Direct', pricing: 'Variable txn fees', threat: 'High', color: 'bg-red-50 text-red-700 border-red-200' },
    { name: 'Wise', type: 'Indirect', pricing: 'Low exchange fees', threat: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { name: 'Razorpay', type: 'Direct', pricing: '2% per transaction', threat: 'Low', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  ],
  HealthTech: [
    { name: 'Teladoc', type: 'Direct', pricing: '$75/visit or co-pay', threat: 'High', color: 'bg-red-50 text-red-700 border-red-200' },
    { name: 'MyFitnessPal', type: 'Indirect', pricing: 'Freemium / $19.99/mo', threat: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { name: 'Zocdoc', type: 'Direct', pricing: 'Free for patients', threat: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { name: 'WebMD', type: 'Indirect', pricing: 'Free / Ad-supported', threat: 'Low', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  ],
  AgriTech: [
    { name: 'CropIn', type: 'Direct', pricing: 'Enterprise SaaS', threat: 'High', color: 'bg-red-50 text-red-700 border-red-200' },
    { name: 'Farmers Business Network', type: 'Direct', pricing: '$250/year', threat: 'High', color: 'bg-red-50 text-red-700 border-red-200' },
    { name: 'DeHaat', type: 'Indirect', pricing: 'Marketplace commission', threat: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { name: 'CropX', type: 'Direct', pricing: 'Hardware + $299/yr subscription', threat: 'Low', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  ],
  Logistics: [
    { name: 'Flexport', type: 'Direct', pricing: 'Custom quote per shipment', threat: 'High', color: 'bg-red-50 text-red-700 border-red-200' },
    { name: 'Deliveroo', type: 'Indirect', pricing: 'Commission + delivery fee', threat: 'High', color: 'bg-red-50 text-red-700 border-red-200' },
    { name: 'Shippo', type: 'Direct', pricing: 'Pay-as-you-go / Custom SaaS', threat: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { name: 'DHL digital', type: 'Indirect', pricing: 'Variable shipping fees', threat: 'Low', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  ],
  Other: [
    { name: 'Salesforce', type: 'Direct', pricing: '$25-$300/user/month', threat: 'High', color: 'bg-red-50 text-red-700 border-red-200' },
    { name: 'Notion', type: 'Indirect', pricing: 'Freemium / $8/user/mo', threat: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { name: 'Zapier', type: 'Indirect', pricing: 'Freemium / $19.99/mo', threat: 'Low', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { name: 'ClickUp', type: 'Direct', pricing: 'Freemium / $7/user/mo', threat: 'Low', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  ]
};

// Generates a unique numeric hash for a given string to keep generated scores deterministic
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

// Calculates a value within a specified range based on a numeric hash
const getScaleValue = (hash, min, max) => {
  return min + (hash % (max - min + 1));
};

// Generates all scorecards, market size estimations, risks, strengths, and plans from database inputs
const enhanceIdeaWithAnalysis = (dbIdea) => {
  const ideaInput = {
    id: dbIdea.id,
    startupName: dbIdea.name,
    problem: dbIdea.problem,
    targetCustomer: dbIdea.target_customer,
    industry: dbIdea.industry,
    businessModel: dbIdea.business_model,
    geography: dbIdea.geography,
    pricing: dbIdea.pricing || '',
    assumptions: dbIdea.assumptions || '',
    founderBg: dbIdea.founder_bg || '',
    date: new Date(dbIdea.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  };

  const hash = hashString(ideaInput.startupName || 'default');
  
  // Use real score from backend if available, otherwise mock it
  const overallScore = dbIdea.overall_score != null 
    ? dbIdea.overall_score 
    : getScaleValue(hash, 55, 94);

  let status = 'Pivot';
  let statusClasses = 'bg-amber-50 text-amber-700 border border-amber-200';
  let iconBg = 'bg-amber-100';
  let iconColor = 'text-amber-600';
  let recommendationStatus = 'Proceed with caution';
  let recommendationDesc = 'Moderate validation required';

  const recLower = (dbIdea.recommendation || '').toLowerCase();

  // If we have a real recommendation of 'go', OR we have no recommendation but a high score
  if (recLower === 'go' || (!dbIdea.recommendation && overallScore >= 75)) {
    status = 'Go';
    statusClasses = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    iconBg = 'bg-[#534AB7]/10';
    iconColor = 'text-[#534AB7]';
    recommendationStatus = 'Proceed';
    recommendationDesc = 'Strong market opportunity detected';
  } 
  // If we have a real recommendation of 'no-go', OR no recommendation but a low score
  else if (recLower === 'no-go' || (!dbIdea.recommendation && overallScore < 50)) {
    status = 'Stop';
    statusClasses = 'bg-red-50 text-red-700 border border-red-200';
    iconBg = 'bg-red-100';
    iconColor = 'text-red-600';
    recommendationStatus = 'Stop / Re-evaluate';
    recommendationDesc = 'High execution risks and competitor threats';
  }

  const categoryData = [
    { name: 'Market Opportunity', score: getScaleValue(hash + 1, 60, 95) },
    { name: 'Problem Severity', score: getScaleValue(hash + 2, 55, 95) },
    { name: 'Competitor Gap', score: getScaleValue(hash + 3, 50, 90) },
    { name: 'MVP Feasibility', score: getScaleValue(hash + 4, 65, 98) },
    { name: 'Willingness to Pay', score: getScaleValue(hash + 5, 45, 90) },
    { name: 'Founder Market Fit', score: getScaleValue(hash + 6, 60, 95) }
  ];

  const marketSize = (getScaleValue(hash + 7, 10, 99) / 10).toFixed(1) + 'B';
  const competitorCount = getScaleValue(hash + 8, 3, 9);
  const mvpEffortMonths = getScaleValue(hash + 9, 2, 5);

  const competitors = COMPETITORS_BY_INDUSTRY[ideaInput.industry] || COMPETITORS_BY_INDUSTRY['Other'];

  const strengths = [
    `Strong target addressable market with high pain points for ${ideaInput.targetCustomer || 'potential users'}`,
    `Business model ${ideaInput.businessModel || 'hypothesized'} offers potential scalable unit economics`,
    `Low-barrier initial MVP feasibility in the ${ideaInput.geography || 'target'} market`,
    ideaInput.founderBg 
      ? `Leverages core team strengths: "${ideaInput.founderBg}"`
      : `Strong focus on solving direct issues regarding: "${ideaInput.problem?.substring(0, 50)}..."`
  ];

  const risks = [
    `Intense competitive landscape in the ${ideaInput.industry || 'general'} tech sector`,
    `Customer acquisition costs for targeting ${ideaInput.targetCustomer || 'users'} might escalate`,
    `Critical reliance on initial key assumptions: "${ideaInput.assumptions?.substring(0, 50) || 'no-code MVP success'}"`,
    `Potential challenges scaling operations in ${ideaInput.geography || 'local markets'}`
  ];

  const planDays = [
    {
      day: 1,
      title: 'Problem Interviews',
      description: `Conduct 5-8 interviews with potential ${ideaInput.targetCustomer || 'users'} in ${ideaInput.geography || 'your area'}. Focus on understanding their pain points with current tools and whether "${ideaInput.problem?.substring(0, 60)}" resonates as a severe problem.`
    },
    {
      day: 2,
      title: 'Competitor Deep Dive',
      description: `Analyze local and global competitors (specifically ${competitors.map(c => c.name).slice(0, 3).join(', ')}). Document their pricing models, major product features, user reviews, and identify gaps your product can fill.`
    },
    {
      day: 3,
      title: 'Landing Page Test',
      description: `Create a simple landing page describing your ${ideaInput.startupName} concept and value proposition. Drive traffic using targeted ads ($50-100 budget). Measure sign-up conversion rate — aim for >5%.`
    },
    {
      day: 4,
      title: 'User Survey',
      description: `Send a structured survey to 50+ potential users. Validate pricing assumptions (${ideaInput.pricing || 'standard premium subscription'}), must-have features, and preferred formats.`
    },
    {
      day: 5,
      title: 'Manual MVP Demo',
      description: `Build a no-code prototype or interactive Figma mockups. Test with 3-5 users and gather qualitative feedback on the core user experience.`
    },
    {
      day: 6,
      title: 'Analyze Results',
      description: `Compile all data from interviews, surveys, landing page signups, and prototype feedback. Calculate key metrics: conversion rate, willingness to pay, and Net Promoter Score.`
    },
    {
      day: 7,
      title: 'Go/Pivot/Stop Decision',
      description: `Present findings to your team or advisors. Make a data-driven decision: proceed with development, pivot the concept, or stop and explore other ideas.`
    }
  ];

  const interviewQuestions = [
    `How do you currently deal with: "${ideaInput.problem?.substring(0, 80)}"? What tools do you use?`,
    `What frustrates you most about existing solutions in the ${ideaInput.industry || 'current'} market?`,
    `If a product named ${ideaInput.startupName} could solve this seamlessly, how valuable would that be on a scale of 1-10?`,
    `How much do you currently spend monthly on solutions for this problem?`,
    ideaInput.pricing ? `Would you be willing to pay ${ideaInput.pricing} for a solution that addresses this?` : `What features would make you willing to pay a premium for a new alternative?`,
    `What would make you switch from your current system to a new product?`
  ];

  const emailText = `Hi [Name],

I noticed you're active in the ${ideaInput.industry || 'industry'} space and dealing with ${ideaInput.targetCustomer || 'similar user demographics'}. I'm researching a new concept called ${ideaInput.startupName} to solve:

"${ideaInput.problem?.substring(0, 150)}..."

Unlike existing products, our approach focuses on: ${ideaInput.assumptions?.substring(0, 100) || 'solving the core user friction directly'}.

I'd love to get your perspective. Would you be open to a quick 10-minute call this week? I'm not selling anything — just trying to understand if this resonates with you.

Thanks for your time!

Best,
[Your Name]
Founder, ${ideaInput.startupName}`;

  const mvpItems = [
    {
      badge: 'Week 1',
      badgeClasses: 'bg-[#534AB7]/10 text-[#534AB7]',
      title: 'Build Core Prototype',
      description: `Create a functional prototype focusing on the primary feature solving: "${ideaInput.problem?.substring(0, 60)}". Keep features minimal and build a simple user interface.`
    },
    {
      badge: 'Week 2',
      badgeClasses: 'bg-[#534AB7]/10 text-[#534AB7]',
      title: 'Beta Testing',
      description: `Recruit 10-15 beta testers from ${ideaInput.targetCustomer || 'your target audience'}. Monitor daily active usage, session duration, and collect feedback through simple channels.`
    },
    {
      badge: 'Success Metric',
      badgeClasses: 'bg-amber-100 text-amber-700',
      title: 'Key Performance Indicator',
      description: `Target: 35%+ weekly active users among beta testers, average usage frequency >3 times/week, and at least 30% of users indicating willingness to pay ${ideaInput.pricing || 'for premium features'}.`
    },
    {
      badge: 'Kill Condition',
      badgeClasses: 'bg-red-100 text-red-700',
      title: 'When to Stop',
      description: `If fewer than 15% of beta testers return after week 1, or if zero users express interest in paying for the solution. These signals indicate a lack of product-market fit.`
    }
  ];

  return {
    ...ideaInput,
    score: overallScore,
    status,
    statusClasses,
    iconBg,
    iconColor,
    recommendationStatus,
    recommendationDesc,
    categoryData,
    marketSize,
    competitorCount,
    mvpEffortMonths,
    competitors,
    strengths,
    risks,
    planDays,
    interviewQuestions,
    emailText,
    mvpItems
  };
};

// Helper function to generate standard HTTP headers including JWT token for Flask backend endpoints
const getAuthHeaders = () => {
  const token = localStorage.getItem('ideavalidator_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Helper to save idea locally when database is unavailable/unauthorized
const saveLocalIdea = (ideaInput) => {
  const localIdeas = JSON.parse(localStorage.getItem('ideavalidator_local_ideas') || '[]');
  const newId = localIdeas.length ? Math.max(...localIdeas.map(i => i.id)) + 1 : 1000;
  
  const mockDbIdea = {
    id: newId,
    name: ideaInput.startupName,
    problem: ideaInput.problem,
    target_customer: ideaInput.targetCustomer,
    industry: ideaInput.industry,
    business_model: ideaInput.businessModel || '',
    geography: ideaInput.geography,
    pricing: ideaInput.pricing || '',
    assumptions: ideaInput.assumptions || '',
    founder_bg: ideaInput.founderBg || '',
    created_at: new Date().toISOString()
  };
  
  localIdeas.push(mockDbIdea);
  localStorage.setItem('ideavalidator_local_ideas', JSON.stringify(localIdeas));
  
  return enhanceIdeaWithAnalysis(mockDbIdea);
};

let cachedIdeas = null;
let lastFetchTime = 0;

// Retrieves all ideas saved in the PostgreSQL database for the logged-in user and analyzes them
export const getIdeas = async (forceRefresh = false) => {
  if (!forceRefresh && cachedIdeas && (Date.now() - lastFetchTime < 60000)) {
    return cachedIdeas;
  }
  
  let dbIdeas = [];
  try {
    const response = await fetch(`${API_BASE}/ideas`, {
      headers: getAuthHeaders()
    });
    if (response.ok) {
      dbIdeas = await response.json();
    }
  } catch (e) {
    console.error("API failed to get ideas, falling back to local only:", e);
  }

  const localIdeas = JSON.parse(localStorage.getItem('ideavalidator_local_ideas') || '[]');
  const allIdeas = [...dbIdeas, ...localIdeas];

  // Remove duplicates by ID
  const uniqueIdeas = [];
  const seenIds = new Set();
  for (const idea of allIdeas) {
    if (!seenIds.has(idea.id)) {
      seenIds.add(idea.id);
      uniqueIdeas.push(idea);
    }
  }

  // Sort by created_at desc
  uniqueIdeas.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const enhancedIdeas = uniqueIdeas.map(idea => enhanceIdeaWithAnalysis(idea));
  cachedIdeas = enhancedIdeas;
  lastFetchTime = Date.now();
  
  return enhancedIdeas;
};

// Saves a new startup idea input to the database, returning the enhanced analysis details
export const saveIdea = async (ideaInput) => {
  const payload = {
    name: ideaInput.startupName,
    problem: ideaInput.problem,
    target_customer: ideaInput.targetCustomer,
    industry: ideaInput.industry,
    business_model: ideaInput.businessModel || '',
    geography: ideaInput.geography,
    pricing: ideaInput.pricing || '',
    assumptions: ideaInput.assumptions || '',
    founder_bg: ideaInput.founderBg || ''
  };

  try {
    const response = await fetch(`${API_BASE}/ideas`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const savedDbIdea = await response.json();
      return enhanceIdeaWithAnalysis(savedDbIdea);
    }

    if (response.status === 401 || response.status === 403) {
      console.warn("Backend unauthorized, saving locally instead");
      return saveLocalIdea(ideaInput);
    }

    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to save idea');
  } catch (err) {
    console.warn("API save failed, saving locally as fallback:", err);
    const localSaved = saveLocalIdea(ideaInput);
    cachedIdeas = null; // Invalidate cache
    return localSaved;
  } finally {
    cachedIdeas = null; // Invalidate cache on successful save too
  }
};

// Retrieves a single startup idea matching the specified database ID
export const getIdeaById = async (id) => {
  const ideas = await getIdeas();
  return ideas.find(idea => String(idea.id) === String(id));
};

// Deletes a specific startup idea from the PostgreSQL database using its database ID
export const deleteIdea = async (id) => {
  // Delete from local storage
  const localIdeas = JSON.parse(localStorage.getItem('ideavalidator_local_ideas') || '[]');
  const filteredLocal = localIdeas.filter(idea => String(idea.id) !== String(id));
  localStorage.setItem('ideavalidator_local_ideas', JSON.stringify(filteredLocal));

  try {
    await fetch(`${API_BASE}/ideas/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  } catch (e) {
    console.error("API delete failed:", e);
  } finally {
    cachedIdeas = null; // Invalidate cache
  }
};

// Returns the current active user profile information stored locally in browser session
export const getCurrentUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Saves the authenticated user profile information to the browser local storage
export const setCurrentUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Removes the local user session details to perform a logout action
export const clearCurrentUser = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('ideavalidator_token');
  cachedIdeas = null;
};

// Clears all cached items and tokens from browser local storage
export const clearAllData = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('ideavalidator_token');
  cachedIdeas = null;
};

// Sends sample predefined startup ideas to the database to populate a fresh portfolio dashboard
export const seedSampleData = async () => {
  const sample1 = {
    startupName: 'AI Tutor Platform',
    problem: 'One-size-fits-all classroom education fails to adapt to individual student learning styles and speeds, leaving many students falling behind.',
    targetCustomer: 'High school students and parents looking for personalized tutoring',
    industry: 'EdTech',
    geography: 'India',
    businessModel: 'SaaS',
    pricing: '$12/month per student',
    assumptions: 'Students will engage with an AI agent conversationally, and parents are willing to pay for supplemental digital tutoring.',
    founderBg: 'Former classroom teacher and software engineer with 5 years experience in edtech'
  };

  const sample2 = {
    startupName: 'Smart Grocery App',
    problem: 'Busy working professionals waste hours planning meals and shopping for groceries, resulting in food waste and poor nutrition.',
    targetCustomer: 'Urban working professionals',
    industry: 'Retail',
    geography: 'Southeast Asia',
    businessModel: 'Freemium',
    pricing: '$4.99/month premium list generation',
    assumptions: 'Users are willing to upload their cooking preferences and synchronize grocery deliveries.',
    founderBg: 'Operations manager at a major food delivery platform'
  };

  const sample3 = {
    startupName: 'EcoTrack Dashboard',
    problem: 'Small and medium businesses want to reduce their carbon footprint but lack transparent, easy-to-use software to measure their emissions.',
    targetCustomer: 'Small and medium business owners',
    industry: 'CleanTech',
    geography: 'Global',
    businessModel: 'SaaS',
    pricing: '$49/month starter tier',
    assumptions: 'SMEs face increasing supply chain compliance pressure and want to publicize green initiatives.',
    founderBg: 'Environmental consultant and web developer'
  };

  await saveIdea(sample1);
  await saveIdea(sample2);
  await saveIdea(sample3);

  return getIdeas();
};
