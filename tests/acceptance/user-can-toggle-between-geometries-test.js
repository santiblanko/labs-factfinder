import { module, test } from 'qunit';
import { visit, currentURL, click, waitFor } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import random from '@turf/random';
import SelectionService from 'labs-nyc-factfinder/services/selection';

const { randomPolygon } = random;

module('Acceptance | user can toggle between geometries', function(hooks) {
  setupApplicationTest(hooks);

  test('user can toggle across different summary levels', async function(assert) {
    const selectionService = this.owner.lookup('service:selection');

    await visit('/');

    await click('[data-test-toggle-blocks]');

    await waitFor('[data-test-toggle-count]'); // wait until the new count loads in View Profile button

    assert.equal(selectionService.get('selectedCount'), 113);

    await click('[data-test-toggle-ntas]');

    await waitFor('[data-test-toggle-count]');

    assert.equal(selectionService.get('selectedCount'), 4);

    await click('[data-test-toggle-tracts]');

    await waitFor('[data-test-toggle-count]');

    assert.equal(selectionService.get('selectedCount'), 69);

    await click('[data-test-toggle-pumas]');

    await waitFor('[data-test-toggle-count]');

    assert.equal(selectionService.get('selectedCount'), 2);

    assert.equal(currentURL(), '/');
  });
});
