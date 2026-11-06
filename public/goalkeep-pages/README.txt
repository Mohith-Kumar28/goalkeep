Goalkeep services and programs pages (static HTML export, 6 Nov 2026)

Open any .html file in a browser. Each page is self-contained apart from the shared images/ folder and the Nunito Sans font, which loads from Google Fonts.

Pages
- impact-and-measurement-strategy.html
- data-systems-and-workflows.html
- dashboards-and-reporting.html
- data-adoption-and-capacity-building.html
- kickstarter.html
- data-literacy-program.html

Notes for development
- Interactions (photo carousels, tappable notes, stage and skill tabs, speech bubbles, nonprofit/funder switch, FAQ, the "show me what happens" flow, and the slide-in contact form) run on a small inline script at the bottom of each page. The markup and inline styles are the design reference; rebuild the interactions in the site's own components.
- The contact forms do not submit anywhere yet; wire them to the site's form handling (intent pre-selected per CTA).
- Menu dropdowns and "explore" cards link between these six files. Other menu items point to "#".
- The closing banner (#contact) carries the Goalkeep mark: its six pieces fly in and assemble on scroll, as on the homepage close. Markup is .gk-mark in the banner's right column; the motion is the last inline script on each page. It hides while the contact form is open and is drawn finished for reduced-motion users.
