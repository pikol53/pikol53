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
  const setText = (sel, val) => { const n = $(sel); if (n) n.textContent = val; };
  setText("#headline", SITE.headline);
  setText("#intro", SITE.intro);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function watchVideo(v) {
    if (!("IntersectionObserver" in window) || reduceMotion) return;
    new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()));
    }, { threshold: 0.4 }).observe(v);
  }

  /* ---------- Projects ---------- */
  const list = $("#projects");

  PROJECTS.filter((p) => !p.hidden).forEach((p) => {
    const art = el("article", "project");

    // media column
    const mediaCol = el("div", "media");
    const stage = el("div", "stage");
    const images = p.media.filter((m) => m.src);
    let current = 0;

    function render(idx) {
      const m = p.media[idx];
      current = idx;
      stage.querySelectorAll("video").forEach((v) => v.pause());
      stage.innerHTML = "";
      if (m.video) {
        stage.className = "stage is-video";
        const v = document.createElement("video");
        v.src = m.video;
        if (m.poster) v.poster = m.poster;
        v.muted = true; v.loop = true; v.playsInline = true; v.controls = true;
        v.preload = "metadata";
        v.setAttribute("aria-label", m.alt || p.title);
        stage.appendChild(v);
        if (idx !== 0) v.play().catch(() => {});      // user picked it: play now
        else watchVideo(v);                           // first item: play when on screen
      } else {
        stage.className = "stage";
        const b = el("button", "stage-btn");
        b.type = "button";
        b.setAttribute("aria-label", `Enlarge image: ${m.alt || p.title}`);
        const img = document.createElement("img");
        img.src = m.src; img.alt = m.alt || p.title; img.loading = "lazy";
        b.appendChild(img);
        b.addEventListener("click", () => openLightbox(images, images.indexOf(m)));
        stage.appendChild(b);
      }
    }
    render(0);
    mediaCol.appendChild(stage);

    if (p.media.length > 1) {
      const thumbs = el("div", "thumbs");
      p.media.forEach((m, i) => {
        const t = el("button", "thumb" + (m.video ? " is-video" : ""));
        t.type = "button";
        t.setAttribute("aria-label", `Show ${m.video ? "video" : "image"} ${i + 1}: ${m.alt || ""}`);
        if (i === 0) t.setAttribute("aria-current", "true");
        if (m.video) {
          if (m.poster) {
            const ti = document.createElement("img"); ti.src = m.poster; ti.alt = ""; t.appendChild(ti);
          } else {
            const tv = document.createElement("video");
            tv.src = m.video + "#t=0.5"; tv.muted = true; tv.preload = "metadata"; tv.tabIndex = -1;
            t.appendChild(tv);
          }
        } else {
          const ti = document.createElement("img"); ti.src = m.src; ti.alt = ""; ti.loading = "lazy";
          t.appendChild(ti);
        }
        t.addEventListener("click", () => {
          if (current === i) return;
          thumbs.querySelectorAll(".thumb").forEach((b) => b.removeAttribute("aria-current"));
          t.setAttribute("aria-current", "true");
          stage.classList.add("is-swapping");
          setTimeout(() => { render(i); }, 160);
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

  /* ---------- More work block ---------- */
  const more = $("#more");
  if (MORE_WORK && MORE_WORK.text) {
    more.appendChild(el("p", null, MORE_WORK.text));
    if (SITE.robloxProfile && MORE_WORK.button) {
      const a = el("a", "btn", MORE_WORK.button);
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
