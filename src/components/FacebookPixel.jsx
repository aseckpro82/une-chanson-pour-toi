import React from "react";

export default function FacebookPixel() {
  const PIXEL_ID = "2177680702641924";

  React.useEffect(() => {
    // Charger le pixel Facebook
    (function(f,b,e,v,n,t,s) {
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)
    })(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }, []);

  return (
    <>
      <noscript>
        <img 
          height="1" 
          width="1" 
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

// Fonctions d'événements à utiliser dans vos pages
export const trackViewContent = (contentName, contentCategory, value = null, currency = 'EUR') => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: contentName,
      content_category: contentCategory,
      value: value,
      currency: currency
    });
  }
};

export const trackAddToCart = (contentName, value, currency = 'EUR') => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_name: contentName,
      value: value,
      currency: currency
    });
  }
};

export const trackInitiateCheckout = (value, currency = 'EUR', contentName = null) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      value: value,
      currency: currency,
      content_name: contentName
    });
  }
};

export const trackPurchase = (value, currency = 'EUR', eventId = null) => {
  if (typeof window !== 'undefined' && window.fbq) {
    const params = {
      value: value,
      currency: currency
    };
    // Meta Pixel deduplication uses 'eventID' field for standard events in some docs,
    // but 'transaction_id' is for Purchase specifically logic inside FB.
    // However, for proper CAPI deduplication, we MUST provide 'eventID' as the 4th argument to fbq('track', ...)
    // OR include it in the data object if the library supports it.
    // The standard Facebook Pixel code: fbq('track', 'Purchase', {value:..., currency:...}, {eventID: '...'});

    if (eventId) {
      // Passer eventID en 4ème argument (options) pour la déduplication Pixel/CAPI
      window.fbq('track', 'Purchase', params, { eventID: eventId });
    } else {
      window.fbq('track', 'Purchase', params);
    }
  }
};

export const trackLead = (contentName = null) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: contentName
    });
  }
};

export const trackContact = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Contact');
  }
};