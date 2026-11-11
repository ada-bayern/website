+++
title="Angebot"
extra.display_newsletter=false
extra.sliding_footer=true
+++

{% <side_text_block title="Angebot" bg="dark" size="big"> %}
Unser Angebot umfasst die folgenden Bausteine. Kommen Sie gerne auf uns zu, um mehr dazu zu erfahren.
{% </side_text_block> %}


<!-- {{ <round_popups /> }} -->

<!-- {{ <image path="angebot/replace-later.jpg" round={true} /> }} -->

<!-- {{ <side_text_block title="Wie wir arbeiten" size="big" compressed="true" /> }} -->
 

{{ <sliding_cards data_path="angebot/cards.toml" config={config} /> }}


{{ <special config={config} /> }}
