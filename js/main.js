const speed = 600;

/**
 * Sets up Justified Gallery.
 */
if (!!$.prototype.justifiedGallery) {
  const options = {
    rowHeight: 140,
    margins: 4,
    lastRow: 'justify',
  };
  $('.article-gallery').justifiedGallery(options);
}

$(document).ready(function () {
  /**
   * Shows the responsive navigation menu on mobile.
   */
  $('#header > #nav > ul > .icon').click(function () {
    $('#header > #nav > ul').toggleClass('responsive');
  });

  /**
   * Controls the different versions of  the menu in blog post articles
   * for Desktop, tablet and mobile.
   */
  if ($('.post').length) {
    const menu = $('#menu');
    const nav = $('#menu > #nav');
    const menuIcon = $('#menu-icon, #menu-icon-tablet');

    /**
     * Display the menu on hi-res laptops and desktops.
     */
    if ($(document).width() >= 960) {
      menu.show(speed);
      menuIcon.addClass('active');
    }

    /**
     * Display the menu if the menu icon is clicked.
     */
    menuIcon.click(function () {
      if (menu.is(':hidden')) {
        menu.show(speed);
        menuIcon.addClass('active');
      } else {
        menu.hide(speed);
        menuIcon.removeClass('active');
      }
      return false;
    });

    /**
     * Add a scroll listener to the menu to hide/show the navigation links.
     */
    if (menu.length) {
      $(window).on('scroll', function () {
        const topDistance = menu.offset().top;

        // hide only the navigation links on desktop
        if (!nav.is(':visible') && topDistance < 50) {
          nav.show(speed);
        } else if (nav.is(':visible') && topDistance > 100) {
          nav.hide(speed);
        }

        // on tablet, hide the navigation icon as well and show a "scroll to top
        // icon" instead
        if (!$('#menu-icon').is(':visible') && topDistance < 50) {
          $('#menu-icon-tablet').show(speed);
          $('#top-icon-tablet').hide(speed);
        } else if (!$('#menu-icon').is(':visible') && topDistance > 100) {
          $('#menu-icon-tablet').hide(speed);
          $('#top-icon-tablet').show(speed);
        }
      });
    }

    /**
     * Show mobile navigation menu after scrolling upwards,
     * hide it again after scrolling downwards.
     */
    if ($('#footer-post').length) {
      let lastScrollTop = 0;
      $(window).on('scroll', function () {
        const topDistance = $(window).scrollTop();

        if (topDistance > lastScrollTop) {
          // downScroll -> show menu
          $('#footer-post').hide(speed);
        } else {
          // upScroll -> hide menu
          $('#footer-post').show(speed);
        }
        lastScrollTop = topDistance;

        // close all submenu"s on scroll
        $('#nav-footer').hide(speed);
        $('#toc-footer').hide(speed);
        $('#share-footer').hide(speed);

        // show a "navigation" icon when close to the top of the page,
        // otherwise show a "scroll to the top" icon
        if (topDistance < 50) {
          $('#actions-footer > #top').hide(speed);
        } else if (topDistance > 100) {
          $('#actions-footer > #top').show(speed);
        }
      });
    }
  }
});
