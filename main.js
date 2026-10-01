(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null && text !== "") n.textContent = text;
    return n;
  };
  const arr = (x) => (Array.isArray(x) ? x.filter(Boolean) : []);
  const setText = (sel, val) => { const n = $(sel); if (n && val) n.textContent = val; };

  const site = typeof SITE === "object" && SITE ? SITE : {};
  const projects = typeof PROJECTS !== "undefined" ? arr(PROJECTS) : [];
  const moreWork = typeof MORE_WORK === "object" && MORE_WORK ? MORE_WORK : null;

  const reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function watchVideo(v) {
    if (!("IntersectionObserver" in window) || reduceMotion) return;
    new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()));
    }, { threshold: 0.4 }).observe(v);
  }

  function makeVideo(m, label) {
    const v = document.createElement("video");
    v.src = m.video;
    if (m.poster) v.poster = m.poster;
    v.muted = true; v.loop = true; v.playsInline = true; v.controls = true;
    v.preload = "metadata";
    v.setAttribute("aria-label", m.alt || label || "Video");
    return v;
  }

  function makeThumbContent(m) {
    if (m.video && !m.poster) {
      const tv = document.createElement("video");
      tv.src = m.video + "#t=0.5"; tv.muted = true; tv.preload = "metadata"; tv.tabIndex = -1;
      return tv;
    }
    const ti = document.createElement("img");
    ti.src = m.video ? m.poster : m.src;
    ti.alt = ""; ti.loading = "lazy";
    return ti;
  }

  /* ---------- Lightbox ---------- */
  const lb = $("#lightbox");
  const lbImg = $("#lb-img");
  let lbItems = [], lbIndex = 0;

  function lbShow(i) {
    if (!lbItems.length || !lbImg) return;
    lbIndex = (i + lbItems.length) % lbItems.length;
    lbImg.src = lbItems[lbIndex].src;
    lbImg.alt = lbItems[lbIndex].alt || "";
  }
  function openLightbox(items, i) {
    if (!lb || !items.length) return;
    lbItems = items;
    lb.classList.toggle("single", items.length < 2);
    lbShow(Math.max(0, i));
    if (typeof lb.showModal === "function") lb.showModal();
    else lb.setAttribute("open", "");
  }
  function closeLightbox() {
    if (!lb) return;
    if (typeof lb.close === "function") lb.close(); else lb.removeAttribute("open");
  }
  if (lb) {
    lb.addEventListener("click", (e) => {
      const act = e.target.dataset ? e.target.dataset.lb : null;
      if (act === "close" || e.target === lb) closeLightbox();
      else if (act === "prev") lbShow(lbIndex - 1);
      else if (act === "next") lbShow(lbIndex + 1);
    });
    lb.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") lbShow(lbIndex - 1);
      if (e.key === "ArrowRight") lbShow(lbIndex + 1);
      if (e.key === "Escape") closeLightbox();
    });
  }

  /* ---------- Site info ---------- */
  setText("#headline", site.headline);
  setText("#intro", site.intro);

  /* ---------- Projects ---------- */
  function renderProject(p) {
    const media = arr(p.media).filter((m) => m.src || m.video);
    const images = media.filter((m) => m.src && !m.video);
    const title = p.title || "";

    const art = el("article", "project");
    const mediaCol = el("div", "media");

    if (media.length) {
      const stage = el("div", "stage");
      let current = -1;

      const render = (idx) => {
        const m = media[idx];
        current = idx;
        stage.querySelectorAll("video").forEach((v) => v.pause());
        stage.innerHTML = "";
        if (m.video) {
          stage.className = "stage is-video";
          const v = makeVideo(m, title);
          stage.appendChild(v);
          if (idx !== 0) v.play().catch(() => {}); else watchVideo(v);
        } else {
          stage.className = "stage";
          const b = el("button", "stage-btn");
          b.type = "button";
          b.setAttribute("aria-label", "Enlarge image" + (title ? ": " + title : ""));
          const img = document.createElement("img");
          img.src = m.src; img.alt = m.alt || title; img.loading = "lazy";
          b.appendChild(img);
          b.addEventListener("click", () => openLightbox(images, images.indexOf(m)));
          stage.appendChild(b);
        }
      };
      render(0);
      mediaCol.appendChild(stage);

      if (media.length > 1) {
        const thumbs = el("div", "thumbs");
        media.forEach((m, i) => {
          const t = el("button", "thumb" + (m.video ? " is-video" : ""));
          t.type = "button";
          t.setAttribute("aria-label", `Show ${m.video ? "video" : "image"} ${i + 1}`);
          if (i === 0) t.setAttribute("aria-current", "true");
          t.appendChild(makeThumbContent(m));
          t.addEventListener("click", () => {
            if (current === i) return;
            thumbs.querySelectorAll(".thumb").forEach((b) => b.removeAttribute("aria-current"));
            t.setAttribute("aria-current", "true");
            stage.classList.add("is-swapping");
            setTimeout(() => render(i), 160);
          });
          thumbs.appendChild(t);
        });
        mediaCol.appendChild(thumbs);
      }
    }

    const info = el("div", "info");

    if (p.stat || p.statLabel) {
      const stat = el("p", "stat");
      if (p.stat) stat.appendChild(el("span", "stat-num", p.stat));
      if (p.statLabel) stat.appendChild(el("span", "stat-label", p.statLabel));
      info.appendChild(stat);
    }

    if (title) info.appendChild(el("h3", null, title));

    const facts = el("dl", "facts");
    const addFact = (k, v) => { if (v) facts.append(el("dt", null, k), el("dd", null, v)); };
    addFact("Role", p.role);
    addFact("Released", p.year);
    if (facts.children.length) info.appendChild(facts);

    if (p.description) info.appendChild(el("p", "desc", p.description));

    const tags = arr(p.tags);
    if (tags.length) {
      const ul = el("ul", "tags");
      ul.setAttribute("aria-label", "Skills");
      tags.forEach((t) => ul.appendChild(el("li", null, t)));
      info.appendChild(ul);
    }

    if (p.link) {
      const a = el("a", "btn", "Play on Roblox");
      a.href = p.link; a.target = "_blank"; a.rel = "noopener";
      info.appendChild(a);
    }

    if (p.footnote) {
      const f = el("div", "footnote");
      if (p.footnote.label) f.appendChild(el("span", null, p.footnote.label));
      arr(p.footnote.lines).forEach((l) => f.appendChild(el("span", null, l)));
      info.appendChild(f);
    }

    if (!media.length) art.classList.add("no-media");
    art.append(mediaCol, info);
    return art;
  }

  const list = $("#projects");
  if (list) {
    projects.filter((p) => !p.hidden).forEach((p) => {
      try { list.appendChild(renderProject(p)); }
      catch (err) { console.error("Could not show a game:", p && p.title, err); }
    });
  }

  /* ---------- More work + gallery ---------- */
  const more = $("#more");
  if (more) {
    try {
      if (!moreWork || moreWork.hidden || (!moreWork.text && !arr(moreWork.media).length)) {
        more.remove();
      } else {
        const head = el("div", "more-head");
        if (moreWork.text) head.appendChild(el("p", null, moreWork.text));
        if (site.robloxProfile && moreWork.button) {
          const a = el("a", "btn", moreWork.button);
          a.href = site.robloxProfile; a.target = "_blank"; a.rel = "noopener";
          head.appendChild(a);
        }
        more.appendChild(head);

        const gMedia = arr(moreWork.media).filter((m) => m.src || m.video);
        const gImages = gMedia.filter((m) => m.src && !m.video);
        if (gMedia.length) {
          const grid = el("div", "gallery");
          gMedia.forEach((m) => {
            if (m.video) {
              const cell = el("div", "gallery-item is-video");
              cell.appendChild(makeVideo(m, "Older project"));
              grid.appendChild(cell);
            } else {
              const b = el("button", "gallery-item");
              b.type = "button";
              b.setAttribute("aria-label", "Enlarge image");
              const img = document.createElement("img");
              img.src = m.src; img.alt = m.alt || ""; img.loading = "lazy";
              b.appendChild(img);
              b.addEventListener("click", () => openLightbox(gImages, gImages.indexOf(m)));
              grid.appendChild(b);
            }
          });
          more.appendChild(grid);
        }
      }
    } catch (err) {
      console.error("Could not show the gallery:", err);
    }
  }

  /* ---------- Contact ---------- */
  const cl = $("#contact-list");
  if (cl) {
    const addContact = (label, value, href) => {
      const li = el("li");
      let node;
      if (href) {
        node = el("a"); node.href = href;
        if (href.startsWith("http")) { node.target = "_blank"; node.rel = "noopener"; }
        node.append(el("small", null, label), el("strong", null, value));
      } else {
        node = el("button"); node.type = "button";
        const small = el("small", null, label);
        node.append(small, el("strong", null, value));
        node.addEventListener("click", () => {
          if (!navigator.clipboard) return;
          navigator.clipboard.writeText(value).then(() => {
            small.textContent = "Copied to clipboard";
            setTimeout(() => (small.textContent = label), 1800);
          }).catch(() => {});
        });
      }
      li.appendChild(node);
      cl.appendChild(li);
    };
    if (site.email) addContact("Email", site.email, "mailto:" + site.email);
    if (site.discord) addContact("Discord, click to copy", site.discord);
    if (site.robloxProfile) addContact("Roblox", "View profile", site.robloxProfile);
  }
})();
