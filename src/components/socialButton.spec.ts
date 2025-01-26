import { describe, it, expect, vi, beforeEach } from "vitest";
import { defineAsyncComponent } from "vue";
import { mount, flushPromises } from "@vue/test-utils";
import SocialBadge from "./socialButton.vue";


const mockIconComponent = (name:string) => ({
    default: {
      name,
      template: `<svg class='${name.toLowerCase()}'></svg>`,
    },
  });
  
  vi.mock("../components/icons/IconDiscord.vue", () => mockIconComponent("IconDiscord"));
  vi.mock("../components/icons/IconTwitter.vue", () => mockIconComponent("IconTwitter"));
  vi.mock("../components/icons/IconTelegram.vue", () => mockIconComponent("IconTelegram"));

  

describe("SocialBadge.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = null;
  });

  it("renders the correct link", () => {
    wrapper = mount(SocialBadge, {
      props: {
        href: "https://example.com",
      },
    });

    const link = wrapper.find("a");
    expect(link.exists()).toBe(true);
    expect(link.attributes("href")).toBe("https://example.com");
    expect(link.attributes("target")).toBe("_blank");
  });

  it("applies the correct color for light mode", () => {
    wrapper = mount(SocialBadge, {
      props: {
        dark: false,
      },
    });

    const badge = wrapper.find(".social-badge");
    expect(badge.attributes("style")).toContain("color: black");
    expect(badge.attributes("style")).toContain("border-color: black");
  });

  it("applies the correct color for dark mode", () => {
    wrapper = mount(SocialBadge, {
      props: {
        dark: true,
      },
    });

    const badge = wrapper.find(".social-badge");
    expect(badge.attributes("style")).toContain("color: white");
    expect(badge.attributes("style")).toContain("border-color: white");
  });

//    it("renders the correct icon based on the type prop", async () => {
//     wrapper = mount(SocialBadge, {
//       props: {
//         type: "discord",
//       },
//     });
//     await flushPromises();
//     const current = wrapper.getCurrentComponent()?.setupState?.img.__asyncResolved
//     console.log("current", current.default.name);
    
//     expect(current.default.name).toBe("IconDiscord");

//     // expect(icon.exists()).toBe(true);
//   });

  it("does not render an icon if the type is unsupported", async () => {
    wrapper = mount(SocialBadge, {
      props: {
        type: "unsupported",
      },
    });

    await wrapper.vm.$nextTick();

    const icon = wrapper.find(".social-badge-icon").find("component");
    expect(icon.exists()).toBe(false);
  });

  it("renders without crashing when no props are provided", () => {
    wrapper = mount(SocialBadge);
    
    expect(wrapper.exists()).toBe(true);
  });
});
