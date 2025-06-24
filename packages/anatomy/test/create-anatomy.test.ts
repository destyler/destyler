import { describe, expect, it } from "vitest"
import { createAnatomy } from "../index"

describe("Anatomy", () => {
  it("should allow to set parts", () => {
    const anatomy = createAnatomy("accordion").parts("root").build()
    expect(anatomy).toMatchInlineSnapshot(`
      {
        "root": {
          "attrs": {
            "data-part": "root",
            "data-scope": "accordion",
          },
          "selector": "&[data-scope="accordion"][data-part="root"], & [data-scope="accordion"][data-part="root"]",
        },
      }
    `)
  })

  it("should convert string to kebab case if needed", () => {
    const anatomy = createAnatomy("hoverCard").parts("toggleButton").build()
    expect(anatomy).toMatchInlineSnapshot(`
      {
        "toggleButton": {
          "attrs": {
            "data-part": "toggle-button",
            "data-scope": "hover-card",
          },
          "selector": "&[data-scope="hover-card"][data-part="toggle-button"], & [data-scope="hover-card"][data-part="toggle-button"]",
        },
      }
    `)
  })

  it("should filter duplicate values", () => {
    const anatomy = createAnatomy("accordion").parts("root", "control", "control").build()
    expect(anatomy).toMatchInlineSnapshot(`
      {
        "control": {
          "attrs": {
            "data-part": "control",
            "data-scope": "accordion",
          },
          "selector": "&[data-scope="accordion"][data-part="control"], & [data-scope="accordion"][data-part="control"]",
        },
        "root": {
          "attrs": {
            "data-part": "root",
            "data-scope": "accordion",
          },
          "selector": "&[data-scope="accordion"][data-part="root"], & [data-scope="accordion"][data-part="root"]",
        },
      }
    `)
  })

  it("should allow to extend the anatomy", () => {
    const anatomy = createAnatomy("accordion").parts("root")
    const extendedAnatomy = anatomy.extendWith("control").build()

    expect(extendedAnatomy).toMatchInlineSnapshot(`
      {
        "control": {
          "attrs": {
            "data-part": "control",
            "data-scope": "accordion",
          },
          "selector": "&[data-scope="accordion"][data-part="control"], & [data-scope="accordion"][data-part="control"]",
        },
        "root": {
          "attrs": {
            "data-part": "root",
            "data-scope": "accordion",
          },
          "selector": "&[data-scope="accordion"][data-part="root"], & [data-scope="accordion"][data-part="root"]",
        },
      }
    `)
  })

  it("should filter duplicates parts when extending", () => {
    const anatomy = createAnatomy("accordion").parts("root", "control")
    const extendedAnatomy = anatomy.extendWith("control").build()

    expect(extendedAnatomy).toMatchInlineSnapshot(`
      {
        "control": {
          "attrs": {
            "data-part": "control",
            "data-scope": "accordion",
          },
          "selector": "&[data-scope="accordion"][data-part="control"], & [data-scope="accordion"][data-part="control"]",
        },
        "root": {
          "attrs": {
            "data-part": "root",
            "data-scope": "accordion",
          },
          "selector": "&[data-scope="accordion"][data-part="root"], & [data-scope="accordion"][data-part="root"]",
        },
      }
    `)
  })

  it("should rename component scope", () => {
    const anatomy = createAnatomy("radio-group").parts("root", "control").rename("segmented-control")
    expect(anatomy.build()).toMatchInlineSnapshot(`
      {
        "control": {
          "attrs": {
            "data-part": "control",
            "data-scope": "segmented-control",
          },
          "selector": "&[data-scope="segmented-control"][data-part="control"], & [data-scope="segmented-control"][data-part="control"]",
        },
        "root": {
          "attrs": {
            "data-part": "root",
            "data-scope": "segmented-control",
          },
          "selector": "&[data-scope="segmented-control"][data-part="root"], & [data-scope="segmented-control"][data-part="root"]",
        },
      }
    `)
  })

  it("should not allow to invoke .parts more than once", () => {
    // @ts-expect-error
    expect(() => createAnatomy("accordion").parts("a").parts("b")).toThrow()
  })

  it("should not allow to invoke .parts when extending", () => {
    const anatomy = createAnatomy("accordion").parts("root", "control")
    // @ts-expect-error
    expect(() => anatomy.parts("b")).toThrow()
  })

  it("should return correct keys", () => {
    const anatomy = createAnatomy("accordion").parts("root", "control")
    const keys = anatomy.keys()

    expect(keys).toEqual(["root", "control"])
  })

  it("should return correct keys when extended", () => {
    const anatomy = createAnatomy("accordion").parts("root", "control").extendWith("part3", "part4")
    const keys = anatomy.keys()

    expect(keys).toEqual(["root", "control", "part3", "part4"])
  })

  describe("kebab-case conversion", () => {
    it("should handle various camelCase patterns", () => {
      const anatomy = createAnatomy("myComponent").parts("toggleButton", "userName", "isActive").build()
      expect(anatomy.toggleButton.attrs["data-part"]).toBe("toggle-button")
      expect(anatomy.userName.attrs["data-part"]).toBe("user-name")
      expect(anatomy.isActive.attrs["data-part"]).toBe("is-active")
    })

    it("should handle PascalCase", () => {
      const anatomy = createAnatomy("MyComponent").parts("ToggleButton").build()
      expect(anatomy.ToggleButton.attrs["data-scope"]).toBe("my-component")
      expect(anatomy.ToggleButton.attrs["data-part"]).toBe("toggle-button")
    })

    it("should handle consecutive uppercase letters", () => {
      const anatomy = createAnatomy("XMLHttpRequest").parts("HTTPSConnection").build()
      expect(anatomy.HTTPSConnection.attrs["data-scope"]).toBe("xml-http-request")
      expect(anatomy.HTTPSConnection.attrs["data-part"]).toBe("https-connection")
    })

    it("should handle underscores and spaces", () => {
      const anatomy = createAnatomy("my_component").parts("user_name", "toggle button").build()
      expect(anatomy.user_name.attrs["data-scope"]).toBe("my-component")
      expect(anatomy.user_name.attrs["data-part"]).toBe("user-name")
      expect(anatomy["toggle button"].attrs["data-part"]).toBe("toggle-button")
    })

    it("should handle numbers in names", () => {
      const anatomy = createAnatomy("form2FA").parts("input2Factor", "step1Of3").build()
      expect(anatomy.input2Factor.attrs["data-scope"]).toBe("form2-fa")
      expect(anatomy.input2Factor.attrs["data-part"]).toBe("input2-factor")
      expect(anatomy.step1Of3.attrs["data-part"]).toBe("step1-of3")
    })

    it("should handle already kebab-case names", () => {
      const anatomy = createAnatomy("my-component").parts("toggle-button").build()
      expect(anatomy["toggle-button"].attrs["data-scope"]).toBe("my-component")
      expect(anatomy["toggle-button"].attrs["data-part"]).toBe("toggle-button")
    })
  })

  describe("edge cases", () => {
    it("should handle empty parts array", () => {
      const anatomy = createAnatomy("component").build()
      expect(anatomy).toEqual({})
    })

    it("should handle single character names", () => {
      const anatomy = createAnatomy("a").parts("b", "c").build()
      expect(anatomy.b.attrs["data-scope"]).toBe("a")
      expect(anatomy.c.attrs["data-scope"]).toBe("a")
    })

    it("should handle special characters in names", () => {
      const anatomy = createAnatomy("my@component").parts("part$1", "part#2").build()
      expect(anatomy["part$1"].attrs["data-scope"]).toBe("my@component")
      expect(anatomy["part#2"].attrs["data-part"]).toBe("part#2")
    })

    it("should handle very long names", () => {
      const longName = "a".repeat(100)
      const longPart = "b".repeat(100)
      const anatomy = createAnatomy(longName).parts(longPart).build()
      expect(anatomy[longPart].attrs["data-scope"]).toBe(longName)
      expect(anatomy[longPart].attrs["data-part"]).toBe(longPart)
    })

    it("should handle many parts", () => {
      const parts = Array.from({ length: 100 }, (_, i) => `part${i}`)
      const anatomy = createAnatomy("component").parts(...parts).build()
      expect(Object.keys(anatomy)).toHaveLength(100)
      expect(anatomy.part0.attrs["data-part"]).toBe("part0")
      expect(anatomy.part99.attrs["data-part"]).toBe("part99")
    })
  })

  describe("error handling", () => {
    it("should throw error when calling parts() multiple times", () => {
      const anatomy = createAnatomy("accordion").parts("root")
      expect(() => (anatomy as any).parts("control")).toThrow(
        "createAnatomy().parts(...) should only be called once. Did you mean to use .extendWith(...) ?"
      )
    })

    it("should throw error when calling parts() after extendWith()", () => {
      const anatomy = createAnatomy("accordion").parts("root").extendWith("control")
      expect(() => (anatomy as any).parts("other")).toThrow(
        "createAnatomy().parts(...) should only be called once. Did you mean to use .extendWith(...) ?"
      )
    })
  })

  describe("selector generation", () => {
    it("should generate correct selectors with multiple data attributes", () => {
      const anatomy = createAnatomy("dialog").parts("overlay", "content").build()

      expect(anatomy.overlay.selector).toBe(
        '&[data-scope="dialog"][data-part="overlay"], & [data-scope="dialog"][data-part="overlay"]'
      )
      expect(anatomy.content.selector).toBe(
        '&[data-scope="dialog"][data-part="content"], & [data-scope="dialog"][data-part="content"]'
      )
    })

    it("should handle selectors with kebab-case conversion", () => {
      const anatomy = createAnatomy("hoverCard").parts("triggerButton").build()

      expect(anatomy.triggerButton.selector).toBe(
        '&[data-scope="hover-card"][data-part="trigger-button"], & [data-scope="hover-card"][data-part="trigger-button"]'
      )
    })
  })

  describe("chaining operations", () => {
    it("should support multiple extendWith calls", () => {
      const anatomy = createAnatomy("menu")
        .parts("root")
        .extendWith("trigger")
        .extendWith("content", "item")
        .extendWith("separator")
        .build()

      expect(Object.keys(anatomy)).toEqual(["root", "trigger", "content", "item", "separator"])
    })

    it("should support rename after extendWith", () => {
      const anatomy = createAnatomy("menu")
        .parts("root")
        .extendWith("item")
        .rename("contextMenu")
        .build()

      expect(anatomy.root.attrs["data-scope"]).toBe("context-menu")
      expect(anatomy.item.attrs["data-scope"]).toBe("context-menu")
    })

    it("should support extendWith after rename", () => {
      const anatomy = createAnatomy("menu")
        .parts("root")
        .rename("contextMenu")
        .extendWith("item")
        .build()

      expect(anatomy.root.attrs["data-scope"]).toBe("context-menu")
      expect(anatomy.item.attrs["data-scope"]).toBe("context-menu")
    })

    it("should support multiple renames", () => {
      const anatomy = createAnatomy("menu")
        .parts("root")
        .rename("contextMenu")
        .rename("rightClickMenu")
        .build()

      expect(anatomy.root.attrs["data-scope"]).toBe("right-click-menu")
    })
  })

  describe("immutability", () => {
    it("should not modify original anatomy when extending", () => {
      const originalAnatomy = createAnatomy("component").parts("root")
      const originalKeys = originalAnatomy.keys()

      const extendedAnatomy = originalAnatomy.extendWith("extra")
      const extendedKeys = extendedAnatomy.keys()

      expect(originalKeys).toEqual(["root"])
      expect(extendedKeys).toEqual(["root", "extra"])
    })

    it("should not modify original anatomy when renaming", () => {
      const originalAnatomy = createAnatomy("component").parts("root")
      const originalBuild = originalAnatomy.build()

      const renamedAnatomy = originalAnatomy.rename("newComponent")
      const renamedBuild = renamedAnatomy.build()

      expect(originalBuild.root.attrs["data-scope"]).toBe("component")
      expect(renamedBuild.root.attrs["data-scope"]).toBe("new-component")
    })

    it("should create independent instances", () => {
      const anatomy1 = createAnatomy("component1").parts("root")
      const anatomy2 = createAnatomy("component2").parts("root")

      const build1 = anatomy1.build()
      const build2 = anatomy2.build()

      expect(build1.root.attrs["data-scope"]).toBe("component1")
      expect(build2.root.attrs["data-scope"]).toBe("component2")
    })
  })

  describe("complex scenarios", () => {
    it("should handle complex component anatomy", () => {
      const anatomy = createAnatomy("dataTable")
        .parts("root", "header", "body", "footer")
        .extendWith("row", "cell", "sortButton")
        .extendWith("pagination", "pageButton", "pageInfo")
        .build()

      expect(Object.keys(anatomy)).toHaveLength(10)
      expect(anatomy.sortButton.attrs["data-scope"]).toBe("data-table")
      expect(anatomy.pageButton.attrs["data-part"]).toBe("page-button")
    })

    it("should handle component inheritance pattern", () => {
      const baseAnatomy = createAnatomy("form").parts("root", "field", "label", "input")
      const searchFormAnatomy = baseAnatomy.extendWith("searchButton", "clearButton").rename("searchForm")
      const loginFormAnatomy = baseAnatomy.extendWith("submitButton", "forgotPasswordLink").rename("loginForm")

      const searchBuild = searchFormAnatomy.build()
      const loginBuild = loginFormAnatomy.build()

      expect(searchBuild.searchButton.attrs["data-scope"]).toBe("search-form")
      expect(loginBuild.submitButton.attrs["data-scope"]).toBe("login-form")
      expect(Object.keys(searchBuild)).toContain("field")
      expect(Object.keys(loginBuild)).toContain("field")
    })

    it("should handle nested component composition", () => {
      const buttonAnatomy = createAnatomy("button").parts("root", "icon", "text")
      const dialogAnatomy = createAnatomy("dialog")
        .parts("root", "overlay", "content")
        .extendWith("header", "body", "footer")
        .extendWith("closeButton", "confirmButton", "cancelButton")

      const buttonBuild = buttonAnatomy.build()
      const dialogBuild = dialogAnatomy.build()

      expect(buttonBuild.icon.attrs["data-scope"]).toBe("button")
      expect(dialogBuild.closeButton.attrs["data-scope"]).toBe("dialog")
      expect(Object.keys(dialogBuild)).toHaveLength(9)
    })
  })

  describe("performance characteristics", () => {
    it("should handle rapid successive operations efficiently", () => {
      let anatomy = createAnatomy("component").parts("root")

      // Simulate building a complex component through many operations
      for (let i = 0; i < 50; i++) {
        anatomy = anatomy.extendWith(`part${i}`) as any
      }

      const result = anatomy.build()
      expect(Object.keys(result)).toHaveLength(51) // root + 50 parts
    })

    it("should deduplicate efficiently with many duplicates", () => {
      const parts = Array(1000).fill("duplicatePart") as string[]
      const anatomy = createAnatomy("component").parts(...parts).build()

      expect(Object.keys(anatomy)).toEqual(["duplicatePart"])
    })
  })

  describe("type safety edge cases", () => {
    it("should maintain type information through method chains", () => {
      const anatomy = createAnatomy("component")
        .parts("root", "content")
        .extendWith("extra")
        .rename("newComponent")

      const keys = anatomy.keys()
      expect(keys).toEqual(["root", "content", "extra"])
    })

    it("should handle empty string parts", () => {
      const anatomy = createAnatomy("component").parts("", "validPart").build()
      expect(anatomy[""]).toBeDefined()
      expect(anatomy.validPart).toBeDefined()
      expect(anatomy[""].attrs["data-part"]).toBe("")
    })
  })
})
