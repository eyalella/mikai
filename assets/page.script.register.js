
  jQuery(document).ready(function () {
      
      var counter = 0;

      initSocialLoginLocale();

      function initSocialLoginLocale() {
        counter++;
        
        if(typeof AddShoppersWidget !== "undefined") {
          setSocialLoginLocale();
        } else if(counter < 50) {
          setTimeout(initSocialLoginLocale, 200);
        }
      }

      function setSocialLoginLocale() {
        AddShoppersWidget.signin_result = function(a, b) {
            var c = document.getElementById("share-buttons-signin-result"),
                d = this._build_background();
            if (!c) c = document.createElement("div"), c.id = "share-buttons-signin-result", c.className = "share-buttons", document.getElementsByTagName("body")[0].appendChild(c);
            c.innerHTML = "";
            if (b) e = '<div class="signin-result">אנא המתני, אנו מעבדים את בקשתך...</div><div onclick="AddShoppersWidget.hide()" class="widget-close"><span class="ui-icon ui-icon-closethick"></span></div>';
            else {
                var message = messageLocale(a.message);
                    e = '<div class="signin-result">' +
                    message + '</div><div onclick="AddShoppersWidget.hide()" class="widget-close"><span class="ui-icon ui-icon-closethick"></span></div><div class="submit-button-container"><a class="submit-button">סגירה</a></div>';
                if (a.params && a.params.event) {
                    var f = a.params.event;
                    delete a.params.event;
                    this.API.Event.trigger(f, a.params)
                }
            }
            c.innerHTML = e;
            if (!b) this.elementByClass("submit-button", c).onclick = function() {
                document.getElementById("share-buttons-overlay").style.display = "none";
                document.getElementById("share-buttons-signin-result").style.display =
                    "none"
            };
            this.hide();
            d.style.display = "block";
            c.style.display = "block";

            function messageLocale(msg) {
                if(msg === "An account already exists for this email address.") {
                    return "כבר קיים חשבון עם כתובת האמייל הזו."
                } else if(msg === "Your account has been created and an activation email has been sent."){
                    return "החשבון שלך נוצר בהצלחה! מייל הפעלה נשלח לתיבת הדואר שלך."
                } else {
                    return msg;
                }
            }
        }
      }
      
  });
