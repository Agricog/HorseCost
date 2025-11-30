import { useEffect } from 'react';
import HorseLiveryCalculator from '../components/HorseLiveryCalculator';

export default function HorseLiveryCalculatorPage() {
  useEffect(() => {
    // Set SEO meta tags
    document.title = 'Horse Livery Cost Calculator | TradeCalcs';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Calculate sustainable pricing for DIY, Part, and Full horse livery packages. Factor in variable costs (feed, labor, bedding) and fixed costs (rent, insurance, salaries) to determine competitive monthly rates.'
      );
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Calculate sustainable pricing for DIY, Part, and Full horse livery packages. Factor in variable costs (feed, labor, bedding) and fixed costs (rent, insurance, salaries) to determine competitive monthly rates.';
      document.head.appendChild(meta);
    }

    // Cleanup
    return () => {
      document.title = 'TradeCalcs - Professional Trade Calculators';
    };
  }, []);

  return <HorseLiveryCalculator />;
}
