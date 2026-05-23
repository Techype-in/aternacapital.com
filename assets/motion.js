/* Aterna Capital — motion.js
 * Abstract SVG line-art per-product motion graphics + process timeline.
 * - Inline-injects SVGs into elements with [data-motion="<key>"].
 * - Stroke-draws on first intersect, then runs idle loops (CSS keyframes).
 * - Honours prefers-reduced-motion (snaps to final state, no loops).
 *
 * Usage: place <div data-motion="term-loan"></div> wherever you want the visual.
 *        Supported keys: term-loan, working-capital, invoice-discounting,
 *                        structured-credit, co-lending, process-timeline.
 */
(function(){
  "use strict";

  // ---- CSS for animations (injected once into <head>) ----
  var CSS = "" +
    ".m-svg{display:block;width:100%;height:auto;color:#2563a8;}" +
    ".m-svg .m-stroke{stroke:currentColor;fill:none;stroke-width:1.2;stroke-linecap:round;stroke-linejoin:round;}" +
    ".m-svg .m-fill{fill:currentColor;}" +
    ".m-svg .m-gold{stroke:#c4902a !important;}" +
    ".m-svg .m-gold-fill{fill:#c4902a;}" +
    ".m-svg .m-draw{stroke-dasharray:var(--len,400);stroke-dashoffset:var(--len,400);transition:stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1);}" +
    "[data-motion].m-active .m-draw{stroke-dashoffset:0;}" +
    "[data-motion]:not(.m-active) .m-dot{opacity:0;}" +
    "[data-motion].m-active .m-dot{opacity:1;transition:opacity .6s ease-out .4s;}" +
    /* idle loops */
    "@keyframes m-pulse{0%,100%{opacity:.4;}50%{opacity:1;}}" +
    "@keyframes m-orbit{from{transform:rotate(0);}to{transform:rotate(360deg);}}" +
    "@keyframes m-float{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}" +
    "@keyframes m-breath{0%,100%{transform:scaleY(1);}50%{transform:scaleY(1.04);}}" +
    "@keyframes m-shimmer{0%,100%{opacity:.5;}50%{opacity:1;}}" +
    "[data-motion].m-active .m-loop-pulse > *{animation:m-pulse 3s ease-in-out infinite;}" +
    "[data-motion].m-active .m-loop-pulse > *:nth-child(2){animation-delay:.4s;}" +
    "[data-motion].m-active .m-loop-pulse > *:nth-child(3){animation-delay:.8s;}" +
    "[data-motion].m-active .m-loop-pulse > *:nth-child(4){animation-delay:1.2s;}" +
    "[data-motion].m-active .m-loop-orbit{animation:m-orbit 14s linear infinite;transform-origin:center;transform-box:fill-box;}" +
    "[data-motion].m-active .m-loop-float{animation:m-float 4s ease-in-out infinite;}" +
    "[data-motion].m-active .m-loop-float-d{animation:m-float 4s ease-in-out infinite;animation-delay:.6s;}" +
    "[data-motion].m-active .m-loop-breath{animation:m-breath 5s ease-in-out infinite;transform-origin:center;transform-box:fill-box;}" +
    "[data-motion].m-active .m-loop-shimmer{animation:m-shimmer 2.4s ease-in-out infinite;}" +
    "@keyframes m-wc-pulse{0%,100%{transform:scaleX(.28);}50%{transform:scaleX(.92);}}" +
    "[data-motion].m-active .m-loop-wc{transform-origin:0 0;transform-box:fill-box;animation:m-wc-pulse 5s ease-in-out infinite;}" +
    "@keyframes m-rotate{from{transform:rotate(0);}to{transform:rotate(360deg);}}" +
    "[data-motion].m-active .m-loop-rotate{transform-origin:center;transform-box:fill-box;animation:m-rotate 6s linear infinite;}" +
    /* prefers-reduced-motion */
    "@media (prefers-reduced-motion: reduce){" +
      ".m-svg .m-draw{transition:none !important;stroke-dashoffset:0 !important;}" +
      "[data-motion] *{animation:none !important;}" +
      "[data-motion] .m-dot{opacity:1 !important;}" +
    "}";

  // ---- SVG templates ----
  // All use viewBox 0 0 200 160 unless noted.
  var SVGS = {
    "term-loan":
      // Term Loan = lump sum principal disbursed → fixed equal EMI repayments → outstanding decreases stepwise
      // Layout: top label, step-down line (principal outstanding), bottom row of equal EMI bars on x-axis with year ticks
      '<svg class="m-svg" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      // Top-left label
      '<text x="14" y="22" font-family="Outfit,sans-serif" font-size="7" font-weight="400" letter-spacing="1.5" fill="#2563a8">PRINCIPAL OUTSTANDING</text>' +
      // Y-axis
      '<line class="m-stroke m-draw" style="--len:88" x1="25" y1="32" x2="25" y2="120"/>' +
      // X-axis
      '<line class="m-stroke m-draw" style="--len:160" x1="25" y1="120" x2="185" y2="120"/>' +
      // Principal step-down (declining outstanding balance)
      '<path class="m-stroke m-draw" style="--len:280" d="M25,38 L55,38 L55,55 L85,55 L85,72 L115,72 L115,89 L145,89 L145,106 L175,106 L175,120"/>' +
      // Equal EMI bars (gold) below x-axis at year midpoints — uniform height = uniform EMI
      '<g class="m-loop-pulse">' +
        '<rect class="m-gold-fill m-dot" x="38" y="125" width="14" height="10" rx="1"/>' +
        '<rect class="m-gold-fill m-dot" x="68" y="125" width="14" height="10" rx="1"/>' +
        '<rect class="m-gold-fill m-dot" x="98" y="125" width="14" height="10" rx="1"/>' +
        '<rect class="m-gold-fill m-dot" x="128" y="125" width="14" height="10" rx="1"/>' +
        '<rect class="m-gold-fill m-dot" x="158" y="125" width="14" height="10" rx="1"/>' +
      '</g>' +
      // Year labels
      '<text x="45" y="148" text-anchor="middle" font-family="Outfit,sans-serif" font-size="7" font-weight="300" fill="#4a5f75">Y1</text>' +
      '<text x="75" y="148" text-anchor="middle" font-family="Outfit,sans-serif" font-size="7" font-weight="300" fill="#4a5f75">Y2</text>' +
      '<text x="105" y="148" text-anchor="middle" font-family="Outfit,sans-serif" font-size="7" font-weight="300" fill="#4a5f75">Y3</text>' +
      '<text x="135" y="148" text-anchor="middle" font-family="Outfit,sans-serif" font-size="7" font-weight="300" fill="#4a5f75">Y4</text>' +
      '<text x="165" y="148" text-anchor="middle" font-family="Outfit,sans-serif" font-size="7" font-weight="300" fill="#4a5f75">Y5</text>' +
      // EMI annotation
      '<text x="116" y="155" text-anchor="middle" font-family="Outfit,sans-serif" font-size="6" font-weight="300" letter-spacing="1.5" fill="#c4902a">EQUAL EMI</text>' +
      '</svg>',

    "working-capital":
      // Working Capital = revolving credit limit. Outer outline = full limit. Gold fill inside oscillates wide↔narrow = drawn balance moving.
      // Circular arrow icon on the right indicates revolving nature.
      '<svg class="m-svg" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      // Top label
      '<text x="100" y="44" text-anchor="middle" font-family="Outfit,sans-serif" font-size="7" font-weight="400" letter-spacing="2" fill="#2563a8">CREDIT LIMIT</text>' +
      // Outer credit-limit capsule
      '<rect class="m-stroke m-draw" style="--len:280" x="25" y="58" width="130" height="28" rx="14"/>' +
      // Inner gold "drawn" rect — width animated via scaleX
      '<rect class="m-gold-fill m-loop-wc m-dot" x="29" y="62" width="122" height="20" rx="10" opacity=".85"/>' +
      // Bottom labels with leader lines
      '<text x="38" y="105" font-family="Outfit,sans-serif" font-size="7" font-weight="400" letter-spacing="1.5" fill="#c4902a">DRAWN</text>' +
      '<text x="116" y="105" font-family="Outfit,sans-serif" font-size="7" font-weight="400" letter-spacing="1.5" fill="#2563a8">AVAILABLE</text>' +
      // Revolving arrow on the right side
      '<g transform="translate(175,72)">' +
        '<path class="m-stroke m-draw m-gold m-loop-rotate" style="--len:55" d="M0,-9 A9,9 0 1,1 -9,0"/>' +
        '<path class="m-stroke m-draw m-gold" style="--len:10" d="M-3,-12 L0,-9 L3,-12"/>' +
      '</g>' +
      // Bottom hint
      '<text x="100" y="135" text-anchor="middle" font-family="Outfit,sans-serif" font-size="7" font-weight="300" fill="#4a5f75">Draw · Use · Repay · Redraw</text>' +
      '</svg>',

    "invoice-discounting":
      '<svg class="m-svg" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      // paper stack (left)
      '<g class="m-loop-float">' +
        '<rect class="m-stroke m-draw" style="--len:130" x="22" y="52" width="48" height="62" rx="2"/>' +
        '<line class="m-stroke m-draw" style="--len:30" x1="32" y1="68" x2="60" y2="68"/>' +
        '<line class="m-stroke m-draw" style="--len:30" x1="32" y1="78" x2="60" y2="78"/>' +
        '<line class="m-stroke m-draw" style="--len:22" x1="32" y1="88" x2="52" y2="88"/>' +
        '<line class="m-stroke m-draw" style="--len:30" x1="32" y1="100" x2="60" y2="100"/>' +
      '</g>' +
      // second page shadow
      '<rect class="m-stroke m-draw" style="--len:130" x="28" y="46" width="48" height="62" rx="2" opacity=".35"/>' +
      // arrow connector
      '<line class="m-stroke m-draw m-gold" style="--len:40" x1="86" y1="80" x2="122" y2="80"/>' +
      '<path class="m-stroke m-draw m-gold" style="--len:20" d="M116,73 L124,80 L116,87"/>' +
      // coin stack (right)
      '<g class="m-loop-float-d">' +
        '<ellipse class="m-stroke m-draw m-gold" style="--len:80" cx="155" cy="68" rx="22" ry="6"/>' +
        '<line class="m-stroke m-draw m-gold" style="--len:14" x1="133" y1="68" x2="133" y2="80"/>' +
        '<line class="m-stroke m-draw m-gold" style="--len:14" x1="177" y1="68" x2="177" y2="80"/>' +
        '<ellipse class="m-stroke m-draw m-gold" style="--len:80" cx="155" cy="80" rx="22" ry="6"/>' +
        '<line class="m-stroke m-draw m-gold" style="--len:14" x1="133" y1="80" x2="133" y2="92"/>' +
        '<line class="m-stroke m-draw m-gold" style="--len:14" x1="177" y1="80" x2="177" y2="92"/>' +
        '<ellipse class="m-stroke m-draw m-gold" style="--len:80" cx="155" cy="92" rx="22" ry="6"/>' +
      '</g>' +
      '</svg>',

    "structured-credit":
      '<svg class="m-svg" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      // Three stacked layered blocks (senior on top, mezz middle, sub bottom)
      '<g class="m-loop-breath">' +
        '<rect class="m-stroke m-draw" style="--len:230" x="50" y="42" width="100" height="22" rx="2"/>' +
        '<text x="58" y="57" font-family="Outfit,sans-serif" font-size="9" font-weight="300" fill="#2563a8" opacity=".8">SENIOR</text>' +
      '</g>' +
      '<line class="m-stroke m-draw m-gold" style="--len:100" x1="50" y1="70" x2="150" y2="70"/>' +
      '<g class="m-loop-breath" style="animation-delay:.6s;">' +
        '<rect class="m-stroke m-draw m-gold" style="--len:230" x="40" y="76" width="120" height="22" rx="2"/>' +
        '<text x="48" y="91" font-family="Outfit,sans-serif" font-size="9" font-weight="300" fill="#c4902a">MEZZANINE</text>' +
      '</g>' +
      '<line class="m-stroke m-draw m-gold" style="--len:120" x1="40" y1="104" x2="160" y2="104"/>' +
      '<g class="m-loop-breath" style="animation-delay:1.2s;">' +
        '<rect class="m-stroke m-draw" style="--len:250" x="30" y="110" width="140" height="22" rx="2" opacity=".75"/>' +
        '<text x="38" y="125" font-family="Outfit,sans-serif" font-size="9" font-weight="300" fill="#2563a8" opacity=".7">SUB-DEBT</text>' +
      '</g>' +
      '</svg>',

    "co-lending":
      '<svg class="m-svg" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      // Two overlapping circles
      '<g class="m-loop-float">' +
        '<circle class="m-stroke m-draw" style="--len:240" cx="75" cy="80" r="42"/>' +
        '<text x="48" y="60" font-family="Outfit,sans-serif" font-size="8" font-weight="300" fill="#2563a8" letter-spacing="1.5">NBFC</text>' +
      '</g>' +
      '<g class="m-loop-float-d">' +
        '<circle class="m-stroke m-draw" style="--len:240" cx="125" cy="80" r="42"/>' +
        '<text x="138" y="60" font-family="Outfit,sans-serif" font-size="8" font-weight="300" fill="#2563a8" letter-spacing="1.5">BANK</text>' +
      '</g>' +
      // intersection node (pulse loop)
      '<circle class="m-loop-shimmer m-gold-fill m-dot" cx="100" cy="80" r="6"/>' +
      '<circle class="m-stroke m-draw m-gold" style="--len:40" cx="100" cy="80" r="9"/>' +
      // small connector lines from edges to node
      '<line class="m-stroke m-draw m-gold" style="--len:18" x1="100" y1="65" x2="100" y2="71"/>' +
      '<line class="m-stroke m-draw m-gold" style="--len:18" x1="100" y1="89" x2="100" y2="95"/>' +
      '</svg>',

    "process-timeline":
      '<svg class="m-svg" viewBox="0 0 720 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid meet">' +
      // baseline
      '<line class="m-stroke m-draw" style="--len:620" x1="60" y1="60" x2="660" y2="60"/>' +
      // nodes
      '<circle class="m-stroke m-draw m-gold-fill m-dot" cx="60" cy="60" r="8"/>' +
      '<circle class="m-stroke m-draw m-gold-fill m-dot" style="animation-delay:.4s" cx="260" cy="60" r="8"/>' +
      '<circle class="m-stroke m-draw m-gold-fill m-dot" style="animation-delay:.8s" cx="460" cy="60" r="8"/>' +
      '<circle class="m-stroke m-draw m-gold-fill m-dot" style="animation-delay:1.2s" cx="660" cy="60" r="8"/>' +
      // node rings (decorative)
      '<circle class="m-stroke m-draw" style="--len:80" cx="60" cy="60" r="13"/>' +
      '<circle class="m-stroke m-draw" style="--len:80" cx="260" cy="60" r="13"/>' +
      '<circle class="m-stroke m-draw" style="--len:80" cx="460" cy="60" r="13"/>' +
      '<circle class="m-stroke m-draw" style="--len:80" cx="660" cy="60" r="13"/>' +
      // labels
      '<text x="60" y="32" text-anchor="middle" font-family="Outfit,sans-serif" font-size="10" font-weight="300" letter-spacing="2" fill="#2563a8">DAY 1</text>' +
      '<text x="260" y="32" text-anchor="middle" font-family="Outfit,sans-serif" font-size="10" font-weight="300" letter-spacing="2" fill="#2563a8">DAYS 2&#8211;5</text>' +
      '<text x="460" y="32" text-anchor="middle" font-family="Outfit,sans-serif" font-size="10" font-weight="300" letter-spacing="2" fill="#2563a8">DAYS 5&#8211;10</text>' +
      '<text x="660" y="32" text-anchor="middle" font-family="Outfit,sans-serif" font-size="10" font-weight="300" letter-spacing="2" fill="#2563a8">DAYS 10&#8211;14</text>' +
      '<text x="60" y="90" text-anchor="middle" font-family="Outfit,sans-serif" font-size="11" font-weight="300" fill="#2d3f52">Share need</text>' +
      '<text x="260" y="90" text-anchor="middle" font-family="Outfit,sans-serif" font-size="11" font-weight="300" fill="#2d3f52">Underwrite</text>' +
      '<text x="460" y="90" text-anchor="middle" font-family="Outfit,sans-serif" font-size="11" font-weight="300" fill="#2d3f52">Proposal</text>' +
      '<text x="660" y="90" text-anchor="middle" font-family="Outfit,sans-serif" font-size="11" font-weight="300" fill="#2d3f52">Disburse</text>' +
      '</svg>'
  };

  // ---- Init ----
  function inject(){
    // Inject CSS once
    if(!document.getElementById("m-css")){
      var st = document.createElement("style");
      st.id = "m-css";
      st.textContent = CSS;
      document.head.appendChild(st);
    }

    var nodes = document.querySelectorAll("[data-motion]");
    var io = "IntersectionObserver" in window ?
      new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){
            e.target.classList.add("m-active");
            io.unobserve(e.target);
          }
        });
      }, {threshold: 0.15, rootMargin: "0px 0px -40px 0px"}) : null;

    nodes.forEach(function(node){
      var key = node.getAttribute("data-motion");
      if(!SVGS[key]) return;
      node.innerHTML = SVGS[key];
      if(io){
        io.observe(node);
      } else {
        node.classList.add("m-active");
      }
    });

    // Fallback: any node already in view at load, activate
    setTimeout(function(){
      nodes.forEach(function(node){
        var r = node.getBoundingClientRect();
        if(r.top < window.innerHeight && r.bottom > 0) node.classList.add("m-active");
      });
    }, 80);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
