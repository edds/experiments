(function () {
  "use strict"

  function Tabs($tabList, options){
    // only add tabs to browsers which support onhashchange (IE 8+).
    if(!"onhashchange" in window) { return; }

    if(!options) { options = {} }
    this.paneIDPrefix = options.panelIDPrefix || 'tab-pane-';
    this.linkIDPrefix = options.linkIDPrefix || 'tab-link-';

    this.$tabList = $tabList;
    this.$tabLinks = this.$tabList.find('a');

    // add link listeners
    this.$tabList.on('click', 'a', this.linkClick.bind(this));

    // add keyboard listeners
    this.$tabList.on('keydown', 'a', this.arrowNavigate.bind(this));

    // add hash change listener
    $(window).on('hashchange', this.hashNavigate.bind(this));

    // add aria goodness
    this.addAriaAttributes();

    // init the tabs state
    this.updateTabs();

    // navigate to a tab if one is defined
    this.hashNavigate();

    this.$initalActiveLink = this.$tabLinks.filter('.active');
  }
  Tabs.prototype = {
    linkClick: function(e) {
      var $link = $(e.target);

      this.$tabLinks.removeClass('active');
      $link.addClass('active');

      this.updateTabs();

      window.location.hash = $link.attr('href');

      e.preventDefault()
    },
    arrowNavigate: function(e) {
      // return if it looks like we are trying to do something else
      if(e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) { return; }

      var $link = $(e.target),
          currentIndex = this.$tabLinks.index($link);

      if(e.which === 37 || e.which === 38){ // left or up
        if(currentIndex > 0) {
          this.$tabLinks.eq( currentIndex - 1 ).focus().click();
        } else {
          this.$tabLinks.eq( this.$tabLinks.length - 1 ).focus().click();
        }
      } else if (e.which === 39 || e.which === 40){ // right or down
        if(currentIndex < this.$tabLinks.length - 1) {
          this.$tabLinks.eq( currentIndex + 1 ).focus().click();
        } else {
          this.$tabLinks.eq( 0 ).focus().click();
        }
      }
    },
    hashNavigate: function(event){
      if(window.location.hash !== ''){
        this.$tabLinks.filter('a[href="' + window.location.hash +'"]').focus().click();
      } else if(window.location.hash === '' && event){
        this.$initalActiveLink.focus().click();
      }
    },
    addAriaAttributes: function() {
      this.$tabList.attr('role', 'tablist');
      this.$tabLinks.each(function(i, el){
        var $tabLink = $(el),
            tabId = $tabLink.attr('href').substr(1),
            $tab = $('#' + tabId),
            linkId = this.linkIDPrefix + tabId,
            newTabId = this.paneIDPrefix + tabId,
            $tab = $('#'+tabId);

        $tab.attr('id' , newTabId);

        $tabLink.attr({
          'id': linkId,
          'role': 'tab',
          'aria-controls': newTabId
        });
        $tab.attr({
          'aria-labelledby': linkId,
          'role': 'tabpanel',
          'tabindex': '-1'
        });
      }.bind(this));
    },
    updateTabs: function(){
      this.$tabLinks.each(function(i, el){
        var $tabLink = $(el),
            tabId = this.paneIDPrefix + $tabLink.attr('href').substr(1),
            $tab = $('#' + tabId),
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
      }.bind(this));
    }
  }

  window.Tabs = Tabs;
}());
