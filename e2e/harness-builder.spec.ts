import { test, expect } from "@playwright/test";

test.describe("AI 하네스 빌더", () => {
  test("should render the main layout", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("AI 하네스 빌더")).toBeVisible();
    await expect(page.getByRole("button", { name: "새로 만들기" })).toBeVisible();
  });

  test("should create a new harness", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "새로 만들기" }).click();
    // After clicking "새로 만들기", an input with value "새 하네스" should appear
    await expect(page.getByPlaceholder("하네스 이름")).toBeVisible();
    await expect(page.getByPlaceholder("하네스 이름")).toHaveValue("새 하네스");
  });

  test("should load a template and show nodes on canvas", async ({ page }) => {
    await page.goto("/");
    // Click templates tab
    await page.getByRole("tab", { name: "템플릿" }).click();
    // Click first template's use button
    await page.getByText("이 템플릿 사용").first().click();
    // Template should load nodes onto the React Flow canvas
    const nodes = page.locator(".react-flow__node");
    await expect(nodes.first()).toBeVisible({ timeout: 10_000 });
    const count = await nodes.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("should select a node and show properties panel", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: "템플릿" }).click();
    await page.getByText("이 템플릿 사용").first().click();
    // Wait for nodes to render
    const firstNode = page.locator(".react-flow__node").first();
    await expect(firstNode).toBeVisible({ timeout: 10_000 });
    // Click the first node
    await firstNode.click();
    // Properties panel should show "에이전트 속성" heading
    await expect(page.getByText("에이전트 속성")).toBeVisible();
  });

  test("should open export dialog", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: "템플릿" }).click();
    await page.getByText("이 템플릿 사용").first().click();
    // Wait for harness to load (export button becomes enabled)
    await expect(page.getByText("내보내기").first()).toBeVisible();
    // Click the toolbar export button (first one, in the toolbar)
    await page.getByText("내보내기").first().click();
    // Dialog should show title and download button
    await expect(page.getByText("하네스 내보내기")).toBeVisible();
    // The dialog footer has an "내보내기" button (the second instance)
    await expect(page.getByText("취소")).toBeVisible();
  });
});
