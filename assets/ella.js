(function(e) {
    if (e(".collection-sidebar")) {
        History.Adapter.bind(window, "statechange", function() {
            var e = History.getState();
            if (!t.isSidebarAjaxClick) {
                t.sidebarParams();
                var n = t.sidebarCreateUrl();
                t.sidebarGetContent(n);
                t.reActivateSidebar()
            }
            t.isSidebarAjaxClick = false
        })
    }
    if (window.use_color_swatch) {
        e(".swatch :radio").change(function() {
            var t = e(this).closest(".swatch").attr("data-option-index");
            var n = e(this).val();
            e(this).closest("form").find(".single-option-selector").eq(t).val(n).trigger("change")
        });
        Shopify.optionsMap = {};
        Shopify.updateOptionsInSelector = function(t) {
            switch (t) {
                case 0:
                    var n = "root";
                    var r = e(".single-option-selector:eq(0)");
                    break;
                case 1:
                    var n = e(".single-option-selector:eq(0)").val();
                    var r = e(".single-option-selector:eq(1)");
                    break;
                case 2:
                    var n = e(".single-option-selector:eq(0)").val();
                    n += " / " + e(".single-option-selector:eq(1)").val();
                    var r = e(".single-option-selector:eq(2)")
            }
            var i = r.val();
            r.empty();
            var s = Shopify.optionsMap[n];
            for (var o = 0; o < s.length; o++) {
                var u = s[o];
                var a = e("<option></option>").val(u).html(u);
                r.append(a)
            }
            e('.swatch[data-option-index="' + t + '"] .swatch-element').each(function() {
                if (e.inArray(e(this).attr("data-value"), s) !== -1) {
                    e(this).removeClass("soldout").show().find(":radio").removeAttr("disabled", "disabled").removeAttr("checked")
                } else {
                    e(this).addClass("soldout").hide().find(":radio").removeAttr("checked").attr("disabled", "disabled")
                }
            });
            if (e.inArray(i, s) !== -1) {
                r.val(i)
            }
            r.trigger("change")
        };
        Shopify.linkOptionSelectors = function(t) {
            for (var n = 0; n < t.variants.length; n++) {
                var r = t.variants[n];
                if (r.available) {
                    Shopify.optionsMap["root"] = Shopify.optionsMap["root"] || [];
                    Shopify.optionsMap["root"].push(r.option1);
                    Shopify.optionsMap["root"] = Shopify.uniq(Shopify.optionsMap["root"]);
                    if (t.options.length > 1) {
                        var i = r.option1;
                        Shopify.optionsMap[i] = Shopify.optionsMap[i] || [];
                        Shopify.optionsMap[i].push(r.option2);
                        Shopify.optionsMap[i] = Shopify.uniq(Shopify.optionsMap[i])
                    }
                    if (t.options.length === 3) {
                        var i = r.option1 + " / " + r.option2;
                        Shopify.optionsMap[i] = Shopify.optionsMap[i] || [];
                        Shopify.optionsMap[i].push(r.option3);
                        Shopify.optionsMap[i] = Shopify.uniq(Shopify.optionsMap[i])
                    }
                }
            }
            Shopify.updateOptionsInSelector(0);
            if (t.options.length > 1) Shopify.updateOptionsInSelector(1);
            if (t.options.length === 3) Shopify.updateOptionsInSelector(2);
            e(".single-option-selector:eq(0)").change(function() {
                Shopify.updateOptionsInSelector(1);
                if (t.options.length === 3) Shopify.updateOptionsInSelector(2);
                return true
            });
            e(".single-option-selector:eq(1)").change(function() {
                if (t.options.length === 3) Shopify.updateOptionsInSelector(2);
                return true
            })
        }
    }
    e(document).ready(function() {
        t.init()
    });
    e(window).resize(function() {
        t.initMobileMenu();
        t.initResizeImage()
    });
    e(window).scroll(function() {
        if (e(this).scrollTop() > 200) {
            e("#back-top").fadeIn()
        } else {
            e("#back-top").fadeOut()
        }
    });
    if (!e(".header-mobile").is(":visible")) {
        e(document).on("click touchstart", function(n) {
            var r = e(".quick-view");
            var i = e("#dropdown-cart");
            var s = e("#cartToggle");
            var o = e("#email-modal .modal-window");
            var u = e(".nav-search");
            if (!r.is(n.target) && r.has(n.target).length === 0 && !i.is(n.target) && i.has(n.target).length === 0 && !s.is(n.target) && s.has(n.target).length === 0 && !o.is(n.target) && o.has(n.target).length === 0 && !u.is(n.target) && u.has(n.target).length === 0) {
                t.closeQuickViewPopup();
                t.closeDropdownCart();
                t.closeEmailModalWindow();
                t.closeDropdownSearch()
            }
        })
    }
    e(document).keyup(function(n) {
        if (n.keyCode == 27) {
            t.closeQuickViewPopup();
            t.closeDropdownCart();
            t.closeDropdownSearch();
            clearTimeout(t.ellaTimeout);
            if (e(".modal").is(":visible")) {
                e(".modal").fadeOut(500)
            }
        }
    });
    var t = {
        ellaTimeout: null,
        isSidebarAjaxClick: false,
        init: function() {
            this.initResizeImage();
            this.initMobileMenu();
            this.initSidebar();
            this.initMobileSidebar();
            this.initScrollTop();
            this.initQuickView();
            this.initCloudzoom();
            this.initProductMoreview();
            this.initAddToCart();
            this.initModal();
            this.initProductAddToCart();
            this.initDropDownCart();
            this.initDropdownSearch();
            this.initToggleCollectionPanel();
            this.initWishlist();
            this.initProductWishlist();
            this.initRemoveWishlist();
            this.initInfiniteScrolling()
        },
        sidebarMapTagEvents: function() {
            e(".sidebar-tag a, .sidebar-tag label").click(function(n) {
                var r = [];
                if (Shopify.queryParams.constraint) {
                    r = Shopify.queryParams.constraint.split("+")
                }
                if (!window.enable_sidebar_multiple_choice && !e(this).prev().is(":checked")) {
                    var i = e(this).parents(".sidebar-tag").find("input:checked");
                    if (i.length > 0) {
                        var s = i.val();
                        if (s) {
                            var o = r.indexOf(s);
                            if (o >= 0) {
                                r.splice(o, 1)
                            }
                        }
                    }
                }
                var s = e(this).prev().val();
                if (s) {
                    var o = r.indexOf(s);
                    if (o >= 0) {
                        r.splice(o, 1)
                    } else {
                        r.push(s)
                    }
                }
                if (r.length) {
                    Shopify.queryParams.constraint = r.join("+")
                } else {
                    delete Shopify.queryParams.constraint
                }
                t.sidebarAjaxClick();
                n.preventDefault()
            })
        },
        sidebarMapCategories: function() {
            e(".sidebar-links a").click(function(n) {
                if (!e(this).hasClass("active")) {
                    delete Shopify.queryParams.q;
                    t.sidebarAjaxClick(e(this).attr("href"));
                    e(".sidebar-links a.active").removeClass("active");
                    e(this).addClass("active")
                }
                n.preventDefault()
            })
        },
        sidebarMapView: function() {
            e(".view-mode a").click(function(n) {
                if (!e(this).hasClass("active")) {
                    var r = e(".filter-show > button span").text();
                    if (e(this).hasClass("list")) {
                        Shopify.queryParams.view = "list" + r
                    } else {
                        Shopify.queryParams.view = r
                    }
                    t.sidebarAjaxClick();
                    e(".view-mode a.active").removeClass("active");
                    e(this).addClass("active")
                }
                n.preventDefault()
            })
        },
        sidebarMapShow: function() {
            e(".filter-show a").click(function(n) {
                if (!e(this).parent().hasClass("active")) {
                    var r = e(this).attr("href");
                    var i = e(".view-mode a.active").attr("href");
                    if (i == "list") {
                        Shopify.queryParams.view = "list" + r
                    } else {
                        Shopify.queryParams.view = r
                    }
                    t.sidebarAjaxClick();
                    e(".filter-show > button span").text(r);
                    e(".filter-show li.active").removeClass("active");
                    e(this).parent().addClass("active")
                }
                n.preventDefault()
            })
        },
        sidebarInitToggle: function() {
            if (e(".sidebar-tag").length > 0) {
                e(".sidebar-tag .widget-title span").click(function() {
                    var t = e(this).parents(".widget-title");
                    if (t.hasClass("click")) {
                        t.removeClass("click")
                    } else {
                        t.addClass("click")
                    }
                    e(this).parents(".sidebar-tag").find(".widget-content").slideToggle()
                })
            }
        },
        sidebarMapSorting: function(n) {
            e(".filter-sortby a").click(function(n) {
                if (!e(this).parent().hasClass("active")) {
                    Shopify.queryParams.sort_by = e(this).attr("href");
                    t.sidebarAjaxClick();
                    var r = e(this).text();
                    e(".filter-sortby > button span").text(r);
                    e(".filter-sortby li.active").removeClass("active");
                    e(this).parent().addClass("active")
                }
                n.preventDefault()
            })
        },
        sidebarMapPaging: function() {
            e(".pagination-page a").click(function(n) {
                var r = e(this).attr("href").match(/page=\d+/g);
                if (r) {
                    Shopify.queryParams.page = parseInt(r[0].match(/\d+/g));
                    if (Shopify.queryParams.page) {
                        var i = t.sidebarCreateUrl();
                        t.isSidebarAjaxClick = true;
                        History.pushState({
                            param: Shopify.queryParams
                        }, i, i);
                        t.sidebarGetContent(i);
                        e("body,html").animate({
                            scrollTop: 500
                        }, 600)
                    }
                }
                n.preventDefault()
            })
        },
        sidebarMapClearAll: function() {
            e(".refined-widgets a.clear-all").click(function(e) {
                delete Shopify.queryParams.constraint;
                delete Shopify.queryParams.q;
                t.sidebarAjaxClick();
                e.preventDefault()
            })
        },
        sidebarMapClear: function() {
            e(".sidebar-tag").each(function() {
                var n = e(this);
                if (n.find("input:checked").length > 0) {
                    n.find(".clear").show().click(function(r) {
                        var i = [];
                        if (Shopify.queryParams.constraint) {
                            i = Shopify.queryParams.constraint.split("+")
                        }
                        n.find("input:checked").each(function() {
                            var t = e(this);
                            var n = t.val();
                            if (n) {
                                var r = i.indexOf(n);
                                if (r >= 0) {
                                    i.splice(r, 1)
                                }
                            }
                        });
                        if (i.length) {
                            Shopify.queryParams.constraint = i.join("+")
                        } else {
                            delete Shopify.queryParams.constraint
                        }
                        t.sidebarAjaxClick();
                        r.preventDefault()
                    })
                }
            })
        },
        sidebarMapEvents: function() {
            t.sidebarMapTagEvents();
            t.sidebarMapCategories();
            t.sidebarMapView();
            t.sidebarMapShow();
            t.sidebarMapSorting()
        },
        reActivateSidebar: function() {
            e(".sidebar-custom .active, .sidebar-links .active").removeClass("active");
            e(".sidebar-tag input:checked").attr("checked", false);
            var n = location.pathname.match(/\/collections\/(.*)(\?)?/);
            if (n && n[1]) {
                e(".sidebar-links a[href='" + n[0] + "']").addClass("active")
            }
            if (Shopify.queryParams.view) {
                e(".view-mode .active").removeClass("active");
                var r = Shopify.queryParams.view;
                if (r.indexOf("list") >= 0) {
                    e(".view-mode .list").addClass("active");
                    r = r.replace("list", "")
                } else {
                    e(".view-mode .grid").addClass("active")
                }
                e(".filter-show > button span").text(r);
                e(".filter-show li.active").removeClass("active");
                e(".filter-show a[href='" + r + "']").parent().addClass("active")
            }
            t.initSortby()
        },
        initSortby: function() {
            if (Shopify.queryParams.sort_by) {
                var t = Shopify.queryParams.sort_by;
                var n = e(".filter-sortby a[href='" + t + "']").text();
                e(".filter-sortby > button span").text(n);
                e(".filter-sortby li.active").removeClass("active");
                e(".filter-sortby a[href='" + t + "']").parent().addClass("active")
            }
        },
        sidebarMapData: function(n) {
            var r = e(".col-main .products-grid");
            if (r.length == 0) {
                r = e(".col-main .product-list")
            }
            var i = e(n).find(".col-main .products-grid");
            if (i.length == 0) {
                i = e(n).find(".col-main .product-list")
            }
            if (i.length > 0 && i.hasClass("products-grid")) {
                if (window.product_image_resize) {
                    i.find("img").fakecrop({
                        fill: window.images_size.is_crop,
                        widthSelector: ".products-grid .grid-item .product-image",
                        ratioWrapper: window.images_size
                    })
                }
            }
            r.replaceWith(i);
            if (t.checkNeedToConvertCurrency()) {
                Currency.convertAll(window.shop_currency, jQuery("#currencies").val(), ".col-main span.money", "money_format")
            }
            if (e(".padding").length > 0) {
                e(".padding").replaceWith(e(n).find(".padding"))
            } else {
                e(".block-row.col-main").append(e(n).find(".padding"))
            }
            var s = e(".page-header");
            var o = e(n).find(".page-header");
            if (s.find("h2").text() != o.find("h2").text()) {
                s.find("h2").replaceWith(o.find("h2"));
                if (s.find(".rte").length) {
                    if (o.find(".rte").length) {
                        s.find(".rte").replaceWith(o.find(".rte"))
                    } else {
                        s.find(".rte").hide()
                    }
                } else {
                    if (o.find(".rte").length) {
                        s.find("h2").after(o.find(".rte"))
                    }
                }
            }
            e(".refined-widgets").replaceWith(e(n).find(".refined-widgets"));
            e(".sidebar-block").replaceWith(e(n).find(".sidebar-block"))
        },
        sidebarCreateUrl: function(t) {
            var n = e.param(Shopify.queryParams).replace(/%2B/g, "+");
            if (t) {
                if (n != "") return t + "?" + n;
                else return t
            }
            return location.pathname + "?" + n
        },
        sidebarAjaxClick: function(e) {
            delete Shopify.queryParams.page;
            var n = t.sidebarCreateUrl(e);
            t.isSidebarAjaxClick = true;
            History.pushState({
                param: Shopify.queryParams
            }, n, n);
            t.sidebarGetContent(n)
        },
        sidebarGetContent: function(n) {
            e.ajax({
                type: "get",
                url: n,
                beforeSend: function() {
                    t.showLoading()
                },
                success: function(e) {
                    t.sidebarMapData(e);
                    t.sidebarMapPaging();
                    t.sidebarMapTagEvents();
                    t.sidebarInitToggle();
                    t.sidebarMapClear();
                    t.sidebarMapClearAll();
                    t.hideLoading();
                    t.initQuickView();
                    t.initAddToCart();
                    t.initWishlist()
                },
                error: function(n, r) {
                    t.hideLoading();
                    e(".loading-modal").hide();
                    e(".ajax-error-message").text(e.parseJSON(n.responseText).description);
                    t.showModal(".ajax-error-modal")
                }
            })
        },
        sidebarParams: function() {
            Shopify.queryParams = {};
            if (location.search.length) {
                for (var e, t = 0, n = location.search.substr(1).split("&"); t < n.length; t++) {
                    e = n[t].split("=");
                    if (e.length > 1) {
                        Shopify.queryParams[decodeURIComponent(e[0])] = decodeURIComponent(e[1])
                    }
                }
            }
        },
        initMobileSidebar: function() {
            e("footer").append("<a class='option-sidebar left' id='displayTextLeft' href='javascript:void(0)' title='Show Sidebar'><span>הצג קטגוריות</span></a>");
            e("#displayTextLeft").click(function(t) {
                t.preventDefault();
                if (e(".sidebar").is(":hidden")) {
                    e(".sidebar").fadeIn(800);
                    e("body,html").animate({
                        scrollTop: 400
                    }, 600);
                    e("#displayTextLeft").toggleClass("hidden-arrow-left");
                    e("#displayTextLeft").attr("title", "hide-sidebar");
                    e("#displayTextLeft").html("<span>הסתר קטגוריות</span>")
                } else {
                    e(".sidebar").fadeOut(800);
                    e("#displayTextLeft").removeClass("hidden-arrow-left");
                    e("#displayTextLeft").attr("title", "show-sidebar");
                    e("#displayTextLeft").html("<span>הצג קטגוריות</span>")
                }
            })
        },
        initSidebar: function() {
            if (e(".collection-sidebar").length > 0) {
                t.sidebarParams();
                t.initSortby();
                t.sidebarMapEvents();
                t.sidebarMapPaging();
                t.sidebarInitToggle();
                t.sidebarMapClear();
                t.sidebarMapClearAll()
            }
        },
        initMobileMenu: function() {
            if (e(".menu-block").is(":visible")) {
                e(".gf-menu-device-container ul.gf-menu li.dropdown").each(function() {
                    if (e(this).find("> p.toogleClick").length == 0) {
                        e(this).prepend('<p class="toogleClick">+</p>')
                    }
                });
                if (e(".menu-block").children().hasClass("gf-menu-device-wrapper") == false) {
                    e(".menu-block").children().addClass("gf-menu-device-wrapper")
                }
                if (e(".gf-menu-device-container").find("ul.gf-menu").size() == 0) {
                    e(".gf-menu-device-container").append(e(".nav-bar .container").html());
                    e(".gf-menu-device-container .site-nav").addClass("gf-menu");
                    e(".gf-menu-device-container .site-nav").removeClass("nav")
                }
                e("p.toogleClick").click(function() {
                    if (e(this).hasClass("mobile-toggle-open")) {
                        e(this).next().next().hide();
                        e(this).removeClass("mobile-toggle-open")
                    } else {
                        e(this).next().next().show();
                        e(this).addClass("mobile-toggle-open")
                    }
                });
                e("p.toogleClick").show();
                e("div.gf-menu-toggle").hide();
                e(".nav-bar .container").hide();
                if (e("ul.gf-menu").hasClass("clicked") == false) {
                    e(".gf-menu").hide();
                    e(".gf-menu li.dropdown ul.site-nav-dropdown").hide()
                }
                e(".col-1 .inner ul.dropdown").parent().each(function() {
                    if (e(this).find("> p.toogleClick").length == 0) {
                        e(this).prepend('<p class="toogleClick">+</p>')
                    }
                });
                e(".cbp-spmenu span.icon-dropdown").remove();
                e("ul.gf-menu li.dropdown").each(function() {
                    if (e(this).find("> p.toogleClick").length == 0) {
                        e(this).prepend('<p class="toogleClick">+</p>')
                    }
                });
                e("p.toogleClick").click(function() {
                    if (e(this).hasClass("mobile-toggle-open")) {
                        e(this).next().next().hide();
                        e(this).removeClass("mobile-toggle-open")
                    } else {
                        e(this).next().next().show();
                        e(this).addClass("mobile-toggle-open")
                    }
                });
                e(".header-panel-bottom ul.customer-links").prependTo(e(".customer-area .dropdown-menu"))
            } else {
                e(".nav-bar .container").show();
                e(".gf-menu").hide();
                e(".customer-area ul.customer-links").appendTo(e(".header-panel-bottom")).after(e(".top-header"))
            }
            if (e(".menu-block").children().hasClass("gf-menu-device-wrapper") == false) {
                e(".menu-block").children().addClass("resized")
            }
        },
        initWishlist: function() {
            e(".grid-item button.wishlist").click(function(n) {
                n.preventDefault();
                var r = e(this).parent();
                var i = r.parents(".grid-item");
                e.ajax({
                    type: "POST",
                    url: "/contact",
                    data: r.serialize(),
                    beforeSend: function() {
                        t.showLoading()
                    },
                    success: function(n) {
                        t.hideLoading();
                        r.html('<a class="wishlist" href="/pages/wish-list" title="Go to wishlist"><span class="icon"></span><span>Go to wishlist</span></a>');
                        var s = i.find(".product-title").text();
                        var o = i.find("a > img").attr("src");
                        e(".ajax-success-modal").find(".ajax-product-title").text(s);
                        e(".ajax-success-modal").find(".ajax-product-image").attr("src", o);
                        e(".ajax-success-modal").find(".btn-go-to-wishlist").show();
                        e(".ajax-success-modal").find(".btn-go-to-cart").hide();
                        t.showModal(".ajax-success-modal")
                    },
                    error: function(n, r) {
                        t.hideLoading();
                        e(".loading-modal").hide();
                        e(".ajax-error-message").text(e.parseJSON(n.responseText).description);
                        t.showModal(".ajax-error-modal")
                    }
                })
            })
        },
        initProductWishlist: function() {
            e(".product button.wishlist").click(function(n) {
                n.preventDefault();
                var r = e(this).parent();
                var i = r.parents(".grid-item");
                e.ajax({
                    type: "POST",
                    url: "/contact",
                    data: r.serialize(),
                    beforeSend: function() {
                        t.showLoading()
                    },
                    success: function(n) {
                        t.hideLoading();
                        r.html('<a class="wishlist" href="/pages/wish-list" title="Go to wishlist"><span class="icon"></span><span>Go to wishlist</span></a>');
                        var i = e(".product-title h2").text();
                        var s = e("#product-featured-image").attr("src");
                        e(".ajax-success-modal").find(".ajax-product-title").text(i);
                        e(".ajax-success-modal").find(".ajax-product-image").attr("src", s);
                        e(".ajax-success-modal").find(".btn-go-to-wishlist").show();
                        e(".ajax-success-modal").find(".btn-go-to-cart").hide();
                        t.showModal(".ajax-success-modal")
                    },
                    error: function(n, r) {
                        t.hideLoading();
                        e(".loading-modal").hide();
                        e(".ajax-error-message").text(e.parseJSON(n.responseText).description);
                        t.showModal(".ajax-error-modal")
                    }
                })
            })
        },
        initRemoveWishlist: function() {
            e(".btn-remove-wishlist").click(function(n) {
                var r = e(this).parents("tr");
                var i = r.find(".tag-id").val();
                var s = jQuery("#remove-wishlist-form");
                s.find("input[name='contact[tags]']").val("x" + i);
                e.ajax({
                    type: "POST",
                    url: "/contact",
                    data: s.serialize(),
                    beforeSend: function() {
                        t.showLoading()
                    },
                    success: function(e) {
                        t.hideLoading();
                        r.fadeOut(1e3)
                    },
                    error: function(n, r) {
                        t.hideLoading();
                        e(".loading-modal").hide();
                        e(".ajax-error-message").text(e.parseJSON(n.responseText).description);
                        t.showModal(".ajax-error-modal")
                    }
                })
            })
        },
        initResizeImage: function() {
            if (window.product_image_resize) {
                e(".products-grid .product-image img").fakecrop({
                    fill: window.images_size.is_crop,
                    widthSelector: ".products-grid .grid-item .product-image",
                    ratioWrapper: window.images_size
                })
            }
        },
        initInfiniteScrolling: function() {
            if (e(".infinite-scrolling").length > 0) {
                e(".infinite-scrolling a").click(function(n) {
                    n.preventDefault();
                    if (!e(this).hasClass("disabled")) {
                        t.doInfiniteScrolling()
                    }
                })
            }
        },
        doInfiniteScrolling: function() {
            var n = e(".block-row .products-grid");
            if (!n.length) {
                n = e(".block-row .product-list")
            }
            if (n) {
                var r = e(".infinite-scrolling a").first();
                e.ajax({
                    type: "GET",
                    url: r.attr("href"),
                    beforeSend: function() {
                        t.showLoading();
                        e(".loading-modal").show()
                    },
                    success: function(i) {
                        t.hideLoading();
                        var s = e(i).find(".block-row .products-grid");
                        if (!s.length) {
                            s = e(i).find(".block-row .product-list")
                        }
                        if (s.length) {
                            if (s.hasClass("products-grid")) {
                                if (window.product_image_resize) {
                                    s.children().find("img").fakecrop({
                                        fill: window.images_size.is_crop,
                                        widthSelector: ".products-grid .grid-item .product-image",
                                        ratioWrapper: window.images_size
                                    })
                                }
                            }
                            n.append(s.children());
                            t.initQuickView();
                            t.initAddToCart();
                            t.initWishlist();
                            if (e(i).find(".infinite-scrolling").length > 0) {
                                r.attr("href", e(i).find(".infinite-scrolling a").attr("href"))
                            } else {
                                r.hide();
                                r.next().show()
                            }
                            if (e(".spr-badge").length > 0) {
                                return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges()
                            }
                        }
                    },
                    error: function(n, r) {
                        t.hideLoading();
                        e(".loading-modal").hide();
                        e(".ajax-error-message").text(e.parseJSON(n.responseText).description);
                        t.showModal(".ajax-error-modal")
                    },
                    dataType: "html"
                })
            }
        },
        closeEmailModalWindow: function() {
            if (e("#email-modal").length > 0 && e("#email-modal").is(":visible")) {
                e("#email-modal .modal-window").fadeOut(600, function() {
                    e("#email-modal .modal-overlay").fadeOut(600, function() {
                        e("#email-modal").hide();
                        e.cookie("emailSubcribeModal", "closed", {
                            expires: 1,
                            path: "/"
                        })
                    })
                })
            }
        },
        showModal: function(n) {
            e(n).fadeIn(500);
            t.ellaTimeout = setTimeout(function() {
                e(n).fadeOut(500)
            }, 5e3)
        },
        initToggleCollectionPanel: function() {
            if (e(".collection-sharing-btn").length > 0) {
                e(".collection-sharing-btn").click(function() {
                    e(".collection-sharing-panel").toggle();
                    if (e(".collection-sharing-panel").is(":visible")) {
                        e(".collection-sharing-btn").addClass("btn-hover");
                        e(".collection-filter-panel").hide();
                        e(".collection-filter-btn").removeClass("btn-hover")
                    } else {
                        e(".collection-sharing-btn").removeClass("btn-hover")
                    }
                })
            }
            if (e(".collection-filter-btn").length > 0) {
                e(".collection-filter-btn").click(function() {
                    e(".collection-filter-panel").toggle();
                    if (e(".collection-filter-panel").is(":visible")) {
                        e(".collection-filter-btn").addClass("btn-hover");
                        e(".collection-sharing-panel").hide();
                        e(".collection-sharing-btn").removeClass("btn-hover")
                    } else {
                        e(".collection-filter-btn").removeClass("btn-hover")
                    }
                });
                e(".collection-filter-panel select").change(function(t) {
                    window.location = e(this).find("option:selected").val()
                })
            }
        },
        checkItemsInDropdownCart: function() {
            if (e("#dropdown-cart .mini-products-list").children().length > 0) {
                e("#dropdown-cart .no-items").hide();
                e("#dropdown-cart .has-items").show()
            } else {
                e("#dropdown-cart .has-items").hide();
                e("#dropdown-cart .no-items").show()
            }
        },
        initModal: function() {
            e(".continue-shopping").click(function() {
                clearTimeout(t.ellaTimeout);
                e(".ajax-success-modal").fadeOut(500)
            });
            e(".close-modal, .overlay").click(function() {
                clearTimeout(t.ellaTimeout);
                e(".ajax-success-modal").fadeOut(500)
            })
        },
        initDropDownCart: function() {
            if (window.dropdowncart_type == "click") {
                e("#cartToggle").click(function() {
                    if (e("#dropdown-cart").is(":visible")) {
                        e("#dropdown-cart").slideUp("fast")
                    } else {
                        e("#dropdown-cart").slideDown("fast")
                    }
                })
            } else {
                if (!("ontouchstart" in document)) {
                    e("#cartToggle").hover(function() {
                        if (!e("#dropdown-cart").is(":visible")) {
                            e("#dropdown-cart").slideDown("fast")
                        }
                    });
                    e(".wrapper-top-cart").mouseleave(function() {
                        e("#dropdown-cart").slideUp("fast")
                    })
                } else {
                    e("#cartToggle").click(function() {
                        if (e("#dropdown-cart").is(":visible")) {
                            e("#dropdown-cart").slideUp("fast")
                        } else {
                            e("#dropdown-cart").slideDown("fast")
                        }
                    })
                }
            }
            t.checkItemsInDropdownCart();
            e("#dropdown-cart .no-items a").click(function() {
                e("#dropdown-cart").slideUp("fast")
            });
            e("#dropdown-cart .btn-remove").click(function(n) {
                n.preventDefault();
                var r = e(this).parents(".item").attr("id");
                r = r.match(/\d+/g);
                Shopify.removeItem(r, function(e) {
                    t.doUpdateDropdownCart(e)
                })
            })
        },
        closeDropdownCart: function() {
            if (e("#dropdown-cart").is(":visible")) {
                e("#dropdown-cart").slideUp("fast")
            }
        },
        initDropdownSearch: function() {
            e(".nav-search .icon-search").click(function() {
                if (e(".header-bottom.on .search-bar").is(":visible")) {
                    e(".header-bottom.on .search-bar").slideUp("fast")
                } else {
                    e(".header-bottom.on .search-bar").slideDown("fast")
                }
            })
        },
        closeDropdownSearch: function() {
            if (e(".header-bottom.on .search-bar").is(":visible")) {
                e(".header-bottom.on .search-bar").slideUp("fast")
            }
        },
        initProductMoreview: function() {
            if (e(".more-view-wrapper-owlslider").length > 0) {
                this.initOwlMoreview()
            } else if (e(".more-view-wrapper-jcarousel").length > 0) {
                this.initJcarouselMoreview()
            }
        },
        initOwlMoreview: function() {
            /*e(".more-view-wrapper-owlslider ul").owlCarousel({
                navigation: true,
                items: 5,
                itemsDesktop: [1199, 4],
                itemsDesktopSmall: [979, 3],
                itemsTablet: [768, 3],
                itemsTabletSmall: [540, 3],
                itemsMobile: [360, 3]
            }).css("visibility", "visible")*/
			e(".more-view-wrapper-owlslider ul").slick({
			    infinite: false,
			    slidesToShow: 5,
			    slidesToScroll: 1,
			    arrows: false,
			    rtl: true,
			    dots: true,
			    autoplay: false
			  }).css("visibility", "visible");
        },
        initJcarouselMoreview: function() {
            e(".more-view-wrapper-jcarousel ul").jcarousel({
                vertical: true
            }).css("visibility", "visible");
            e(".product-img-box").addClass("has-jcarousel");
            e(".more-view-wrapper").css("visibility", "visible")
        },
        initCloudzoom: function() {
            if (e("#product-featured-image").length > 0) {
                if (e(".visible-phone").is(":visible")) {
                    e("#product-featured-image").elevateZoom({
                        gallery: "more-view-carousel",
                        cursor: "pointer",
                        galleryActiveClass: "active",
                        imageCrossfade: false,
                        scrollZoom: false,
                        onImageSwapComplete: function() {
                            e(".zoomWrapper div").hide()
                        },
                        loadingIcon: window.loading_url
                    });
                    e("#product-featured-image").bind("click", function(e) {
                        return false
                    })
                } else {
                    e("#product-featured-image").elevateZoom({
                        gallery: "more-view-carousel",
                        cursor: "pointer",
                        galleryActiveClass: "active",
                        imageCrossfade: true,
                        scrollZoom: true,
                        onImageSwapComplete: function() {
                            e(".zoomWrapper div").hide()
                        },
                        loadingIcon: window.loading_url
                    });
                    e("#product-featured-image").bind("click", function(t) {
                        var n = e("#product-featured-image").data("elevateZoom");
                        e.fancybox(n.getGalleryList());
                        return false
                    })
                }
            }
        },
        initScrollTop: function() {
            e("#back-top").click(function() {
                e("body,html").animate({
                    scrollTop: 0
                }, 400);
                return false
            })
        },
        initProductAddToCart: function() {
            if (e("#product-add-to-cart").length > 0) {
                e("#product-add-to-cart").click(function(n) {
                    n.preventDefault();
                    if (e(this).attr("disabled") != "disabled") {
                        if (!window.ajax_cart) {
                            e(this).closest("form").submit()
                        } else {
                            var r = e("#add-to-cart-form select[name=id]").val();
                            if (!r) {
                                r = e("#add-to-cart-form input[name=id]").val()
                            }
                            var i = e("#add-to-cart-form input[name=quantity]").val();
                            if (!i) {
                                i = 1
                            }
                            var s = e(".product-title h2").text();
                            var o = e("#product-featured-image").attr("src");
                            t.doAjaxAddToCart(r, i, s, o)
                        }
                    }
                    return false
                })
            }
        },
        initAddToCart: function() {
            if (e(".add-to-cart-btn").length > 0) {
                e(".add-to-cart-btn").click(function(n) {
                    n.preventDefault();
                    if (e(this).attr("disabled") != "disabled") {
                        var r = e(this).parents(".product-item");
                        var i = e(r).attr("id");
                        i = i.match(/\d+/g);
                        if (!window.ajax_cart) {
                            e("#product-actions-" + i).submit()
                        } else {
                            var s = e("#product-actions-" + i + " select[name=id]").val();
                            if (!s) {
                                s = e("#product-actions-" + i + " input[name=id]").val()
                            }
                            var o = e("#product-actions-" + i + " input[name=quantity]").val();
                            if (!o) {
                                o = 1
                            }
                            var u = e(r).find(".product-title").text();
                            var a = e(r).find(".product-grid-image img").attr("src");
                            t.doAjaxAddToCart(s, o, u, a)
                        }
                    }
                    return false
                })
            }
        },
        showLoading: function() {
            e(".loading-modal").show()
        },
        hideLoading: function() {
            e(".loading-modal").hide()
        },
        doAjaxAddToCart: function(n, r, i, s) {
            e.ajax({
                type: "post",
                url: "/cart/add.js",
                data: "quantity=" + r + "&id=" + n,
                dataType: "json",
                beforeSend: function() {
                    t.showLoading()
                },
                success: function(n) {
                    t.hideLoading();
                    e(".ajax-success-modal").find(".ajax-product-title").text(i);
                    e(".ajax-success-modal").find(".ajax-product-image").attr("src", s);
                    e(".ajax-success-modal").find(".btn-go-to-wishlist").hide();
                    e(".ajax-success-modal").find(".btn-go-to-cart").show();
                    t.showModal(".ajax-success-modal");
                    t.updateDropdownCart()
                },
                error: function(n, r) {
                    t.hideLoading();
                    e(".ajax-error-message").text(e.parseJSON(n.responseText).description);
                    t.showModal(".ajax-error-modal")
                }
            })
        },
        initQuickView: function() {
            e(".quickview-button a").click(function() {
                var n = e(this).attr("id");
                Shopify.getProduct(n, function(n) {
                    var r = e("#quickview-template").html();
                    e(".quick-view").html(r);
                    var i = e(".quick-view");
                    i.find(".product-title a").text(n.title);
                    i.find(".product-title a").attr("href", n.url);
                    if (i.find(".product-vendor span").length > 0) {
                        i.find(".product-vendor span").text(n.vendor)
                    }
                    if (i.find(".product-type span").length > 0) {
                        i.find(".product-type span").text(n.type)
                    }
                    if (i.find(".product-inventory span").length > 0) {
                        var s = n.variants[0].inventory_quantity;
                        if (s > 0) {
                            if (n.variants[0].inventory_management != null) {
                                i.find(".product-inventory span").text(s + " in stock")
                            } else {
                                i.find(".product-inventory span").text("זמין במלאי")
                            }
                        } else {
                            i.find(".product-inventory span").text("Out of stock")
                        }
                    }
                    if (n.description.indexOf("[countdown]") > 0) {
                        var o = n.description.match(/\[countdown\](.*)\[\/countdown\]/);
                        if (o && o.length > 0) {
                            i.find(".countdown").show();
                            i.find(".quickview-clock").countdown(o[1], function(t) {
                                e(this).html(t.strftime("%Dd %H:%M:%S"))
                            })
                        }
                    }
                    if (i.find(".product-description").length > 0) {
                        var u = n.description.replace(/(<([^>]+)>)/ig, "");
                        var u = u.replace(/\[countdown\](.*)\[\/countdown\]/g, "");
                        u = u.split(" ").splice(0, 20).join(" ") + "...";
                        i.find(".product-description").text(u)
                    } else {
                        i.find(".product-description").remove()
                    }
                    i.find(".price").html(Shopify.formatMoney(n.price, window.money_format));
                    i.find(".product-item").attr("id", "product-" + n.id);
                    i.find(".variants").attr("id", "product-actions-" + n.id);
                    i.find(".variants select").attr("id", "product-select-" + n.id);
                    if (n.compare_at_price > n.price) {
                        i.find(".compare-price").html(Shopify.formatMoney(n.compare_at_price_max, window.money_format)).show();
                        i.find(".price").addClass("on-sale")
                    } else {
                        i.find(".compare-price").html("");
                        i.find(".price").removeClass("on-sale")
                    }
                    if (!n.available) {
                        i.find("select, input, .total-price, .dec, .inc, .variants label").remove();
                        i.find(".add-to-cart-btn").text("Unavailable").addClass("disabled").attr("disabled", "disabled");
                    } else {
                        i.find(".total-price span").html(Shopify.formatMoney(n.price, window.money_format));
                        if (window.use_color_swatch) {
                            t.createQuickViewVariantsSwatch(n, i)
                        } else {
                            t.createQuickViewVariants(n, i)
                        }
                    }
                    i.find(".button").on("click", function() {
                        var n = i.find(".quantity").val(),
                            r = 1;
                        if (e(this).text() == "+") {
                            r = parseInt(n) + 1
                        } else if (n > 1) {
                            r = parseInt(n) - 1
                        }
                        i.find(".quantity").val(r);
                        if (i.find(".total-price").length > 0) {
                            t.updatePricingQuickview()
                        }
                    });
                    if (window.show_multiple_currencies) {
                        Currency.convertAll(window.shop_currency, jQuery("#currencies").val(), "span.money", "money_format")
                    }
                    t.loadQuickViewSlider(n, i);
                    t.initQuickviewAddToCart();
                    e(".quick-view").fadeIn(500);
                    if (e(".quick-view .total-price").length > 0) {
                        e(".quick-view input[name=quantity]").on("change", t.updatePricingQuickview)
                    }
                });
                return false
            });
            e(".quick-view .overlay, .close-window").live("click", function() {
                t.closeQuickViewPopup();
                return false
            })
        },
        updatePricingQuickview: function() {
            var t = /([0-9]+[.|,][0-9]+[.|,][0-9]+)/g;
            var n = e(".quick-view .price").text().match(t);
            if (!n) {
                t = /([0-9]+[.|,][0-9]+)/g;
                n = e(".quick-view .price").text().match(t)
            }
            if (n) {
                var r = n[0];
                var i = r.replace(/[.|,]/g, "");
                var s = parseInt(e(".quick-view input[name=quantity]").val());
                var o = i * s;
                var u = Shopify.formatMoney(o, window.money_format);
                u = u.match(t)[0];
                var a = new RegExp(r, "g");
                var f = e(".quick-view .price").html().replace(a, u);
                e(".quick-view .total-price span").html(f)
            }
        },
        initQuickviewAddToCart: function() {
            if (e(".quick-view .add-to-cart-btn").length > 0) {
                e(".quick-view .add-to-cart-btn").click(function() {
                    var n = e(".quick-view select[name=id]").val();
                    if (!n) {
                        n = e(".quick-view input[name=id]").val()
                    }
                    var r = e(".quick-view input[name=quantity]").val();
                    if (!r) {
                        r = 1
                    }
                    var i = e(".quick-view .product-title a").text();
                    var s = e(".quick-view .quickview-featured-image img").attr("src");
                    t.doAjaxAddToCart(n, r, i, s);
                    t.closeQuickViewPopup()
                })
            }
        },
        updateDropdownCart: function() {
            Shopify.getCart(function(e) {
                t.doUpdateDropdownCart(e)
            })
        },
        doUpdateDropdownCart: function(n) {
            var r = '<li class="item" id="cart-item-{ID}"><a href="{URL}" title="{TITLE}" class="product-image"><img src="{IMAGE}" alt="{TITLE}"></a><div class="product-details"><a href="javascript:void(0)" title="Remove This Item" class="btn-remove">X</a><p class="product-name"><a href="{URL}">{TITLE}</a></p><div class="cart-collateral">{QUANTITY} x <span class="price">{PRICE}</span></div></div></li>';
            e("#cartCount").text(n.item_count);
            e("#dropdown-cart .summary .price").html(Shopify.formatMoney(n.total_price, window.money_format));
            e("#dropdown-cart .mini-products-list").html("");
            if (n.item_count > 0) {
                for (var i = 0; i < n.items.length; i++) {
                    var s = r;
                    s = s.replace(/\{ID\}/g, n.items[i].id);
                    s = s.replace(/\{URL\}/g, n.items[i].url);
                    s = s.replace(/\{TITLE\}/g, n.items[i].title);
                    s = s.replace(/\{QUANTITY\}/g, n.items[i].quantity);
                    s = s.replace(/\{IMAGE\}/g, Shopify.resizeImage(n.items[i].image, "small"));
                    s = s.replace(/\{PRICE\}/g, Shopify.formatMoney(n.items[i].price, window.money_format));
                    e("#dropdown-cart .mini-products-list").append(s)
                }
                e("#dropdown-cart .btn-remove").click(function(n) {
                    n.preventDefault();
                    var r = e(this).parents(".item").attr("id");
                    r = r.match(/\d+/g);
                    Shopify.removeItem(r, function(e) {
                        t.doUpdateDropdownCart(e)
                    })
                });
                if (t.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, jQuery("#currencies").val(), "#dropdown-cart span.money", "money_format")
                }
            }
            t.checkItemsInDropdownCart()
        },
        checkNeedToConvertCurrency: function() {
            return window.show_multiple_currencies && Currency.currentCurrency != shopCurrency
        },
        loadQuickViewSlider: function(n, r) {
            var s = Shopify.resizeImage(n.featured_image, "grande");
            r.find(".quickview-featured-image").append('<a href="' + n.url + '"><img src="' + s + '" title="' + n.title + '"/><div style="height: 100%; width: 100%; top:0; left:0 z-index: 2000; position: absolute; display: none; background: url(' + window.loading_url + ') 50% 50% no-repeat;"></div></a>');
            if (n.images.length > 2) {
                var o = r.find(".more-view-wrapper ul");
                for (i in n.images) {
                    var u = Shopify.resizeImage(n.images[i], "grande");
                    var a = Shopify.resizeImage(n.images[i], "compact");
                    var f = '<li><a href="javascript:void(0)" data-image="' + u + '"><img src="' + a + '"  /></a></li>';
                    o.append(f)
                }
                o.find("a").click(function() {
                    var t = r.find(".quickview-featured-image img");
                    var n = r.find(".quickview-featured-image div");
                    if (t.attr("src") != e(this).attr("data-image")) {
                        t.attr("src", e(this).attr("data-image"));
                        n.show();
                        t.load(function(t) {
                            n.hide();
                            e(this).unbind("load");
                            n.hide()
                        })
                    }
                });
                if (o.hasClass("quickview-more-views-owlslider")) {
                    t.initQuickViewCarousel(o)
                } else {
                    t.initQuickViewVerticalMoreview(o)
                }
            } else {
                r.find(".quickview-more-views").remove();
                r.find(".quickview-more-view-wrapper-jcarousel").remove()
            }
        },
        initQuickViewCarousel: function(e) {
            if (e) {
                e(".more-view-wrapper-owlslider ul").slick({
				    infinite: false,
				    slidesToShow: 5,
				    slidesToScroll: 1,
				    rtl: true,
				    arrows: false,
				    dots: true,
				    autoplay: false
			  	}).css("visibility", "visible");
                /*e.owlCarousel({
                    navigation: true,
                    items: 5,
                    itemsDesktop: [1199, 4],
                    itemsDesktopSmall: [979, 3],
                    itemsTablet: [768, 3],
                    itemsTabletSmall: [540, 3],
                    itemsMobile: [360, 3]
                }).css("visibility", "visible")*/
            }
        },
        initQuickViewVerticalMoreview: function(t) {
            if (t) {
                t.jcarousel({
                    vertical: true
                });
                e(".product-img-box").addClass("has-jcarousel");
                e(".more-view-wrapper").css("visibility", "visible")
            }
        },
        convertToSlug: function(e) {
            return e.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
        },
        createQuickViewVariantsSwatch: function(t, n) {
            if (t.variants.length > 1) {
                for (var r = 0; r < t.variants.length; r++) {
                    var i = t.variants[r];
                    var s = '<option value="' + i.id + '">' + i.title + "</option>";
                    n.find("form.variants > select").append(s)
                }
                new Shopify.OptionSelectors("product-select-" + t.id, {
                    product: t,
                    onVariantSelected: selectCallbackQuickview
                });
                var o = window.file_url.substring(0, window.file_url.lastIndexOf("?"));
                var u = window.asset_url.substring(0, window.asset_url.lastIndexOf("?"));
                var a = "";
                for (var r = 0; r < t.options.length; r++) {
                    a += '<div class="swatch clearfix" data-option-index="' + r + '">';
                    a += '<div class="header">' + t.options[r].name + "</div>";
                    var f = false;
                    if (/Color|Colour/i.test(t.options[r].name)) {
                        f = true
                    }
                    var l = new Array;
                    for (var c = 0; c < t.variants.length; c++) {
                        var i = t.variants[c];
                        var h = i.options[r];
                        var p = this.convertToSlug(h);
                        var d = "swatch-" + r + "-" + p;
                        if (l.indexOf(h) < 0) {
                            a += '<div data-value="' + h + '" class="swatch-element ' + (f ? "color" : "") + p + (i.available ? " available " : " soldout ") + '">';
                            if (f) {
                                a += '<div class="tooltip">' + h + "</div>"
                            }
                            a += '<input id="' + d + '" type="radio" name="option-' + r + '" value="' + h + '" ' + (c == 0 ? " checked " : "") + (i.available ? "" : " disabled") + " />";
                            if (f) {
                                a += '<label for="' + d + '" style="background-color: ' + p + "; background-image: url(" + o + p + '.png)"><img class="crossed-out" src="' + u + 'soldout.png" /></label>'
                            } else {
                                a += '<label for="' + d + '">' + h + '<img class="crossed-out" src="' + u + 'soldout.png" /></label>'
                            }
                            a += "</div>";
                            if (i.available) {
                                e('.quick-view .swatch[data-option-index="' + r + '"] .' + p).removeClass("soldout").addClass("available").find(":radio").removeAttr("disabled")
                            }
                            l.push(h)
                        }
                    }
                    a += "</div>"
                }
                n.find("form.variants > select").after(a);
                n.find(".swatch :radio").change(function() {
                    var t = e(this).closest(".swatch").attr("data-option-index");
                    var n = e(this).val();
                    e(this).closest("form").find(".single-option-selector").eq(t).val(n).trigger("change")
                });
                if (t.available) {
                    Shopify.optionsMap = {};
                    Shopify.linkOptionSelectors(t)
                }
            } else {
                n.find("form.variants > select").remove();
                var v = '<input type="hidden" name="id" value="' + t.variants[0].id + '">';
                n.find("form.variants").append(v)
            }
        },
        createQuickViewVariants: function(t, n) {
            if (t.variants.length > 1) {
                for (var r = 0; r < t.variants.length; r++) {
                    var i = t.variants[r];
                    var s = '<option value="' + i.id + '">' + i.title + "</option>";
                    n.find("form.variants > select").append(s)
                }
                new Shopify.OptionSelectors("product-select-" + t.id, {
                    product: t,
                    onVariantSelected: selectCallbackQuickview
                });
                e(".quick-view .single-option-selector").selectize();
                e(".quick-view .selectize-input input").attr("disabled", "disabled");
                if (t.options.length == 1) {
                    e(".selector-wrapper:eq(0)").prepend("<label>" + t.options[0].name + "</label>")
                }
                n.find("form.variants .selector-wrapper label").each(function(n, r) {
                    e(this).html(t.options[n].name)
                })
            } else {
                n.find("form.variants > select").remove();
                var o = '<input type="hidden" name="id" value="' + t.variants[0].id + '">';
                n.find("form.variants").append(o)
            }
        },
        closeQuickViewPopup: function() {
            e(".quick-view").fadeOut(500)
        }
    }
})(jQuery)