import { testid, TestSuite } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

export class ImageTestSuite extends TestSuite {
  positioner = testid('positioner')

  async ShouldLoadImageSuccessfully() {
    const image = page.locatoring('img')

    // Wait for image to load
    await expect.element(image).toBeVisible({ timeout: 5000 })

    // Check that image has loaded
    const naturalWidth = await image.evaluate(img => (img as HTMLImageElement).naturalWidth)
    const naturalHeight = await image.evaluate(img => (img as HTMLImageElement).naturalHeight)

    expect(naturalWidth).toBeGreaterThan(0)
    expect(naturalHeight).toBeGreaterThan(0)

    // Check loading state
    await expect.element(image).toHaveAttribute('data-state', 'loaded')
  }

  async ShouldShowLoadingState() {
    const image = page.locatoring('img')
    const loadingIndicator = page.locatoring('[data-part="loading"]')

    // Initially should show loading state
    if (loadingIndicator.all().length > 0) {
      await expect.element(loadingIndicator).toBeVisible()
      await expect.element(image).toHaveAttribute('data-state', 'loading')
    }
  }

  async ShouldShowErrorStateOnFailure() {
    // This test would need a component that loads a broken image
    const image = page.locatoring('img[src*="broken"]')
    const errorIndicator = page.locatoring('[data-part="error"]')

    if (image.all().length > 0) {
      // Wait for error state
      await expect.element(image).toHaveAttribute('data-state', 'error', { timeout: 5000 })

      if (errorIndicator.all().length > 0) {
        await expect.element(errorIndicator).toBeVisible()
      }
    }
  }

  async ShouldHaveCorrectAltText() {
    const image = page.locatoring('img')

    // Image should have alt attribute for accessibility
    const altText = await image.getAttribute('alt')
    expect(altText).toBeTruthy()
  }

  async ShouldRespectLazyLoading() {
    const image = page.locatoring('img[loading="lazy"]')

    if (image.all().length > 0) {
      // Check that lazy loading attribute is set
      await expect.element(image).toHaveAttribute('loading', 'lazy')

      // Initially might not be loaded if outside viewport
      const isInViewport = await image.isVisible({ timeout: 1000 }).catch(() => false)

      if (!isInViewport) {
        // Scroll image into view
        await image.scrollIntoViewIfNeeded()

        // Now it should start loading
        await expect.element(image).toBeVisible({ timeout: 5000 })
      }
    }
  }

  async ShouldHandleMultipleSources() {
    const picture = page.locatoring('picture')
    const sources = page.locatoring('source')
    const image = page.locatoring('picture img')

    if (picture.all().length > 0) {
      // Check that picture element has sources
      expect(sources.all().length).toBeGreaterThan(0)

      // Image should still load
      await expect.element(image).toBeVisible({ timeout: 5000 })

      const naturalWidth = await image.evaluate(img => (img as HTMLImageElement).naturalWidth)
      expect(naturalWidth).toBeGreaterThan(0)
    }
  }

  async ShouldSupportImageFallback() {
    const image = page.locatoring('img')
    const fallback = page.locatoring('[data-part="fallback"]')

    // If there's a fallback element
    if (fallback.all().length > 0) {
      const imageState = await image.getAttribute('data-state')

      if (imageState === 'error') {
        // Fallback should be visible when image fails
        await expect.element(fallback).toBeVisible()
      } else if (imageState === 'loaded') {
        // Fallback should be hidden when image loads
        await expect.element(fallback).not.toBeVisible()
      }
    }
  }

  async ShouldMaintainAspectRatio() {
    const image = page.locatoring('img')
    const container = page.locatoring('[data-part="container"]')

    if (container.all().length > 0) {
      // Check if aspect ratio is maintained
      const containerBox = await container.boundingBox()
      const imageBox = await image.boundingBox()

      if (containerBox && imageBox) {
        // Image should fit within container
        expect(imageBox.width).toBeLessThanOrEqual(containerBox.width + 1) // +1 for rounding
        expect(imageBox.height).toBeLessThanOrEqual(containerBox.height + 1)
      }
    }
  }

  async ShouldSupportObjectFit() {
    const image = page.locatoring('img')

    // Check if image has object-fit style
    const objectFit = await image.evaluate(img => {
      return window.getComputedStyle(img).objectFit
    })

    // Should have some object-fit value (cover, contain, fill, etc.)
    expect(['cover', 'contain', 'fill', 'scale-down', 'none']).toContain(objectFit)
  }

  async ShouldHandleImageClick() {
    const image = page.locatoring('img')
    const overlay = page.locatoring('[data-part="overlay"]')

    // Click on image
    await userEvent.click(image)

    // If there's an overlay (for lightbox functionality)
    if (overlay.all().length > 0) {
      await expect.element(overlay).toBeVisible()
    }
  }

  async ShouldSupportResponsiveImages() {
    const image = page.locatoring('img[srcset]')

    if (image.all().length > 0) {
      // Should have srcset for responsive images
      const srcset = await image.getAttribute('srcset')
      expect(srcset).toBeTruthy()
      expect(srcset?.length).toBeGreaterThan(0)

      // Should also have sizes attribute
      const sizes = await image.getAttribute('sizes')
      if (sizes) {
        expect(sizes.length).toBeGreaterThan(0)
      }
    }
  }

  async ShouldPreventDragByDefault() {
    const image = page.locatoring('img')

    // Check if draggable is set to false by default
    const draggable = await image.getAttribute('draggable')
    expect(draggable).toBe('false')
  }

  async ShouldHaveLoadingIndicator() {
    const image = page.locatoring('img')
    const loadingSpinner = page.locatoring('[data-part="loading-spinner"]')

    // If image is still loading
    const imageState = await image.getAttribute('data-state')

    if (imageState === 'loading' && loadingSpinner.all().length > 0) {
      await expect.element(loadingSpinner).toBeVisible()
    }
  }
}
