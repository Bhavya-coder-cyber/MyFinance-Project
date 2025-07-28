"use client";
import React, { useEffect, useRef } from 'react';

function TradingViewWidget({ Comp_name }: { Comp_name: string }) {
  const container: any = useRef(null);

  useEffect(() => {
    if (!container.current) return;

    // Clear previous chart if exists
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      "allow_symbol_change": true,
      "calendar": false,
      "details": false,
      "hide_side_toolbar": true,
      "hide_top_toolbar": false,
      "hide_legend": false,
      "hide_volume": true,
      "interval": "D",
      "locale": "en",
      "save_image": false,
      "style": "1",
      "symbol": Comp_name.toUpperCase(),
      "theme": "dark",
      "timezone": "Etc/UTC",
      "backgroundColor": "rgba(46, 46, 46, 1)",
      "gridColor": "rgba(46, 46, 46, 0.06)",
      "width": "100%",
      "height": 400
    });

    container.current.appendChild(script);
  }, [Comp_name]); // re-run when stock symbol changes

  return (
    <div className="tradingview-widget-container w-full" ref={container}></div>
  );
}

export default TradingViewWidget;
