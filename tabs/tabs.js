(function () {
  "use strict"

  var tabs = {
    linkClick: function(e) {
      var $link = $(this),
          $tabList = $link.closest('.js-tabs'),
          $tabLinks = $tabList.find('a');

      $tabLinks.removeClass('active');
      $link.addClass('active');

      tabs.updateTabs($tabLinks);

      e.preventDefault()
    },
    arrowNavigate: function(e) {
      var $link = $(this),
          $tabList = $link.closest('.js-tabs'),
          $tabLinks = $tabList.find('a'),
          currentIndex = $tabLinks.index($link);

      if(e.which === 37 || e.which === 38){ // left or up
        if(currentIndex > 0) {
          $tabLinks.eq( currentIndex - 1 ).focus().click();
        } else {
          $tabLinks.eq( $tabLinks.length - 1 ).focus().click();
        }
      } else if (e.which === 39 || e.which === 40){ // right or down
        if(currentIndex < $tabLinks.length - 1) {
          $tabLinks.eq( currentIndex + 1 ).focus().click();
        } else {
          $tabLinks.eq( 0 ).focus().click();
        }
      }
    },
    addAriaAttributes: function($tabList, $linkTabs) {
      $tabList.attr('role', 'tablist');
      $linkTabs.each(function(i, el){
        var $tabLink = $(el),
            tabId = $tabLink.attr('href').substr(1),
            linkId = 'tab-link-' + tabId,
            $tab = $('#'+tabId);

        $tabLink.attr({
          'id': linkId,
          'role': 'tab',
          'aria-controls': tabId
        });
        $tab.attr({
          'aria-labelledby': linkId,
          'role': 'tabpanel',
          'tabindex': '-1'
        });
      });
    },
    updateTabs: function($tabLinks){
      $tabLinks.each(function(i, el){
        var $tabLink = $(el),
            $tab = $($tabLink.attr('href')),
            active = $tabLink.hasClass('active');

        $tabLink.attr({
          'aria-selected': (active ? 'true' : 'false'),
          'tabindex': (active ? '0' : '-1')
        });
        $tab.attr({
          'aria-hidden': (active ? 'false' : 'true'),
          'aria-expanded': (active ? 'true' : 'false')
        });
        $tab.css('display', (active ? '' : 'none'));
      });
    },
    init: function(){
      // find all the tab lists and iterate over them
      $('.js-tabs').each(function(i, el){
        var $tabList = $(el),
            $tabLinks = $tabList.find('a');

        // add link listeners
        $tabLinks.click(tabs.linkClick);

        // add keyboard listeners
        $tabLinks.keydown(tabs.arrowNavigate);

        // add aria goodness
        tabs.addAriaAttributes($tabList, $tabLinks);

        // init the tabs state
        tabs.updateTabs($tabLinks);
      });
    }
  }

  window.tabs = tabs;
}());
