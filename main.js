// You shouldn't need to edit this file. Content lives in projects.js.

(function () {
  const $ = (sel) => document.querySelector(sel);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  /* ---------- Site info ---------- */
  document.title = `${SITE.name} | 3D artist & Roblox developer`;
  $("#brand").textContent = SITE.name;
  $("#headline").textContent = SITE.headline;
  $("#intro").textContent = SITE.intro;
  $("#foot-name").textContent = `© ${new Date().getFullYear()} ${SITE.name}`;

  /* ---------- Projects ---------- */
  const list = $("#projects");

  PROJECTS.filter((p) => !p.hidden).forEach((p) => {
    const art = el("article", "project");

    // media column
    const mediaCol = el("div", "media");
    const first = p.media[0];
    let stage;

    if (first.video) {
      stage = el("div", "stage is-video");
      const v = document.createElement("video");
      v.src = first.video;
      if (first.poster) v.poster = first.poster;
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.controls = true;
      v.preload = "metadata";
      v.setAttribute("aria-label", first.alt || p.title);
      stage.appendChild(v);
      // play only while on screen
      if ("IntersectionObserver" in window &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        new IntersectionObserver((entries) => {
          entries.forEach((e) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()));
        }, { threshold: 0.4 }).observe(v);
      }
    } else {
      stage = el("button", "stage");
      stage.type = "button";
      stage.setAttribute("aria-label", `Enlarge image: ${first.alt}`);
      const img = document.createElement("img");
      img.src = first.src;
      img.alt = first.alt || p.title;
      img.loading = "lazy";
      stage.appendChild(img);
      stage.dataset.index = "0";
      stage.addEventListener("click", () =>
        openLightbox(p.media.filter((m) => m.src), Number(stage.dataset.index)));
    }
    mediaCol.appendChild(stage);

    const images = p.media.filter((m) => m.src);
    if (images.length > 1) {
      const thumbs = el("div", "thumbs");
      images.forEach((m, i) => {
        const t = el("button", "thumb");
        t.type = "button";
        t.setAttribute("aria-label", `Show image ${i + 1}: ${m.alt}`);
        if (i === 0) t.setAttribute("aria-current", "true");
        const ti = document.createElement("img");
        ti.src = m.src; ti.alt = ""; ti.loading = "lazy";
        t.appendChild(ti);
        t.addEventListener("click", () => {
          if (stage.dataset.index === String(i)) return;
          thumbs.querySelectorAll(".thumb").forEach((b) => b.removeAttribute("aria-current"));
          t.setAttribute("aria-current", "true");
          const img = stage.querySelector("img");
          stage.classList.add("is-swapping");
          setTimeout(() => {
            img.src = m.src; img.alt = m.alt;
            stage.dataset.index = String(i);
            stage.setAttribute("aria-label", `Enlarge image: ${m.alt}`);
            img.onload = () => stage.classList.remove("is-swapping");
            if (img.complete) stage.classList.remove("is-swapping");
          }, 180);
        });
        thumbs.appendChild(t);
      });
      mediaCol.appendChild(thumbs);
    }

    // info column
    const info = el("div", "info");

    const stat = el("p", "stat");
    stat.append(el("span", "stat-num", p.stat), el("span", "stat-label", p.statLabel));
    info.appendChild(stat);

    info.appendChild(el("h3", null, p.title));

    const facts = el("dl", "facts");
    const addFact = (k, v) => { if (v) facts.append(el("dt", null, k), el("dd", null, v)); };
    addFact("Role", p.role);
    addFact("Released", p.year);
    if (facts.children.length) info.appendChild(facts);

    info.appendChild(el("p", "desc", p.description));

    if (p.tags && p.tags.length) {
      const ul = el("ul", "tags");
      ul.setAttribute("aria-label", "Skills");
      p.tags.forEach((t) => ul.appendChild(el("li", null, t)));
      info.appendChild(ul);
    }

    if (p.link) {
      const a = el("a", "btn", "Play on Roblox");
      a.href = p.link; a.target = "_blank"; a.rel = "noopener";
      info.appendChild(a);
    }

    if (p.footnote) {
      const f = el("div", "footnote");
      f.appendChild(el("span", null, p.footnote.label));
      p.footnote.lines.forEach((l) => f.appendChild(el("span", null, l)));
      info.appendChild(f);
    }

    art.append(mediaCol, info);
    list.appendChild(art);
  });

  /* ---------- More work line ---------- */
  const more = $("#more");
  if (MORE_WORK) {
    more.textContent = MORE_WORK + " ";
    if (SITE.robloxProfile && !SITE.robloxProfile.includes("YOUR_USER_ID")) {
      const a = el("a", null, "See them on my Roblox profile");
      a.href = SITE.robloxProfile; a.target = "_blank"; a.rel = "noopener";
      more.appendChild(a);
    }
  } else {
    more.remove();
  }

  /* ---------- Contact ---------- */
  const cl = $("#contact-list");
  const addContact = (label, value, href) => {
    const li = el("li");
    let node;
    if (href) {
      node = el("a"); node.href = href;
      if (href.startsWith("http")) { node.target = "_blank"; node.rel = "noopener"; }
    } else {
      // Discord: click to copy the username
      node = el("button"); node.type = "button";
      node.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(value);
          node.querySelector("small").textContent = "Copied to clipboard";
          setTimeout(() => (node.querySelector("small").textContent = "Discord, click to copy"), 1800);
        } catch (e) { /* clipboard unavailable */ }
      });
    }
    node.append(el("small", null, label), el("strong", null, value));
    li.appendChild(node);
    cl.appendChild(li);
  };
  if (SITE.email) addContact("Email", SITE.email, `mailto:${SITE.email}`);
  if (SITE.discord) addContact("Discord, click to copy", SITE.discord);
  if (SITE.robloxProfile) addContact("Roblox", "View profile", SITE.robloxProfile);

  /* ---------- Lightbox ---------- */
  const lb = $("#lightbox");
  const lbImg = $("#lb-img");
  let lbItems = [], lbIndex = 0;

  function show(i) {
    lbIndex = (i + lbItems.length) % lbItems.length;
    lbImg.src = lbItems[lbIndex].src;
    lbImg.alt = lbItems[lbIndex].alt || "";
  }
  function openLightbox(items, i) {
    lbItems = items;
    lb.classList.toggle("single", items.length < 2);
    show(i);
    lb.showModal();
  }
  lb.addEventListener("click", (e) => {
    const act = e.target.dataset.lb;
    if (act === "close" || e.target === lb) lb.close();
    else if (act === "prev") show(lbIndex - 1);
    else if (act === "next") show(lbIndex + 1);
  });
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(lbIndex - 1);
    if (e.key === "ArrowRight") show(lbIndex + 1);
  });
})();
