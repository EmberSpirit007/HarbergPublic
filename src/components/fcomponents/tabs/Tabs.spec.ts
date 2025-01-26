import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import FTabs from './FTabs.vue';
import FTab from './FTab.vue';

describe('FTabs.vue', () => {
  it('renders tabs correctly', () => {
    const wrapper = mount(FTabs, {
      slots: {
        default: `
          <f-tab label="Tab 1" name="tab1">Tab 1</f-tab>
          <f-tab label="Tab 2" name="tab2">Tab 2</f-tab>
        `,
      },
      global: {
        components: { FTab },
      },
    });

    expect(wrapper.text()).toContain('Tab 1');
    expect(wrapper.text()).toContain('Tab 2');
  });

  it('activates the first tab by default via v-model', async () => {
    const wrapper = mount(FTabs, {
      slots: {
        default: `
          <f-tab label="Tab 1" name="tab1">Tab 1</f-tab>
          <f-tab label="Tab 2" name="tab2">Tab 2</f-tab>
        `,
      },
      props: {
        modelValue: 'tab1', // v-model initial value
      },
      global: {
        components: { FTab },
      },
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const sections = wrapper.findAll('section');
    
     expect(sections[0].attributes('style')).not.toContain('display: none'); 
    expect(sections[1].attributes('style')).toContain('display: none');
   
  });

  it('switches to the correct tab on click', async () => {
    const wrapper = mount(FTabs, {
      slots: {
        default: `
          <f-tab label="Tab 1" name="tab1">Tab 1</f-tab>
          <f-tab label="Tab 2" name="tab2">Tab 2</f-tab>
        `,
      },
      global: {
        components: { FTab },
      },
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    const tabs = wrapper.findAll('.f-tab');
    await tabs[1].trigger('click');

    const sections = wrapper.findAll('section');
    expect(sections[0].attributes('style')).toContain('display: none'); 
    expect(sections[1].attributes('style')).not.toContain('display: none');
  });
});
