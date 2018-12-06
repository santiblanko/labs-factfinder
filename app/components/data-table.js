import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  mode: 'current',
  reliability: false,
  comparison: true,

  year1: 'y2012_2016',
  year2: 'y2006_2010',
  category: '',

  t1: computed('year1', function() {
    const { year1 } = this.getProperties('year1');

    return this.get(`model.${year1}`);
  }),

  t2: computed('year2', function() {
    const { year2 } = this.getProperties('year2');

    return this.get(`model.${year2}`);
  }),

  stickyTop: computed('media.isLarge', function() {
    const { isLarge } = this.getProperties('media.isLarge');

    return isLarge ? 175 : 0;
  }),

  classNames: 'data-table',

  windowResize: service(),
  metrics: service(),

  actions: {
    handleCopy() {
      const [el] = this.get('element').getElementsByClassName('wrapper-for-copy');
      const { body } = document;
      let range;
      let sel;
      if (document.createRange && window.getSelection) {
        range = document.createRange();
        sel = window.getSelection();
        sel.removeAllRanges();
        try {
          range.selectNodeContents(el);
          sel.addRange(range);
        } catch (e) {
          range.selectNode(el);
          sel.addRange(range);
        }
      } else if (body.createTextRange) {
        range = body.createTextRange();
        range.moveToElementText(el);
        range.select();
      }

      document.execCommand('copy');

      this.get('metrics').trackEvent('GoogleAnalytics', {
        eventCategory: 'Data',
        eventAction: 'Copy table to clipboard',
      });
    },
  },

  didInsertElement() {
    this.$('.table-scroll').on('scroll', function() {
      const thisOffset = $(this).offset(); // eslint-disable-line
      const tableOffset = $(this).find('.body-table').offset(); // eslint-disable-line
      const offset = tableOffset.left - thisOffset.left;
      $(this).parents('.data-table').find('.header-table').css({ marginLeft: offset }); // eslint-disable-line
    });

    this.get('windowResize').on('didResize', () => {
      const tableWidth = this.$().find('.table-scroll').width();
      this.$().find('.sticky-element--sticky').width(tableWidth);
    });
  },

});
