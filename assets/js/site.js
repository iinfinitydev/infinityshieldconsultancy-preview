(function () {
  var btn = document.getElementById("mobile-menu-btn");
  var menu = document.getElementById("mobile-menu");
  if (btn && menu) {
    btn.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.addEventListener("click", function (e) {
    document.querySelectorAll("details.nav-drop[open]").forEach(function (d) {
      if (!d.contains(e.target)) d.removeAttribute("open");
    });
  });

  var params = new URLSearchParams(window.location.search);
  var wanted = params.get("service");
  var select = document.getElementById("service");
  if (wanted && select) {
    var match = Array.prototype.find.call(select.options, function (opt) {
      return opt.value === wanted;
    });
    if (match) select.value = wanted;
  }

  /* Coverage pins live in assets/images/uae-coverage.svg.
     To add a city later, drop another pin group at its lon/lat. */

  var form = document.getElementById("consultancy-form");
  if (!form) return;

  function showModal(title, text) {
    var wrap = document.createElement("div");
    wrap.className = "modal";
    wrap.innerHTML =
      '<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="thanks-title">' +
      '<div class="check" aria-hidden="true">✓</div>' +
      "<h3 id=\"thanks-title\">" + title + "</h3>" +
      '<p class="muted">' + text + "</p>" +
      '<button class="btn btn-gold btn-block" type="button">Return to website</button>' +
      "</div>";
    document.body.appendChild(wrap);
    wrap.querySelector("button").addEventListener("click", function () {
      wrap.remove();
    });
    wrap.addEventListener("click", function (ev) {
      if (ev.target === wrap) wrap.remove();
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var submit = form.querySelector('button[type="submit"]');
    var honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value) return;
    submit.disabled = true;
    var data = new FormData(form);
    fetch("https://formsubmit.co/ajax/jay@infinityshieldfiresafety.ae", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data,
    })
      .then(function (res) {
        return res.json().then(function (body) {
          return { ok: res.ok, body: body };
        });
      })
      .then(function (result) {
        if (result.ok) {
          showModal(
            "Thank you.",
            "Your request has been emailed to the consultancy team. We typically respond within four hours on a UAE business day."
          );
          form.reset();
          if (wanted && select) select.value = wanted;
        } else {
          showModal(
            "Send us an email instead.",
            'The form could not be delivered just then. Please write to <a href="mailto:jay@infinityshieldfiresafety.ae">info@infinityshieldfiresafety.ae</a>.'
          );
        }
      })
      .catch(function () {
        showModal(
          "Send us an email instead.",
          'The form could not be delivered just then. Please write to <a href="mailto:jay@infinityshieldfiresafety.ae">info@infinityshieldfiresafety.ae</a>.'
        );
      })
      .then(function () {
        submit.disabled = false;
      });
  });
})();
