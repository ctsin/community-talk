type Plan = "personal" | "team" | "enterprise";
type Pricing = number | ((users: number) => number);

const plans = {
  personal: 10,
  team: (users: number) => users * 5,
  enterprie: (users: number) => users * 20,
  //     ^^ Oh no! We have a typo in "enterprise"
};

const pricingA = plans.personal.toFixed(2);

const pricingB = plans.team(10).toFixed(2);

// ERROR: Property 'enterprise' does not exist on type...
const pricingC = plans.enterprise(50).toFixed(2);