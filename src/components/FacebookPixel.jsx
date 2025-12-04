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

export const trackPurchase = (value, currency = 'EUR', orderId = null) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      value: value,
      currency: currency,
      transaction_id: orderId
    });
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