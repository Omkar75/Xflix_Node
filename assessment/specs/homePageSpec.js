import homePage from "../pages/homePage";

describe("XFlix", () => {
  beforeEach(() => {
    homePage.goto();
  });

  it('should display 5 genre buttons on a row', () => {
    homePage.genre().should("have.length", 5);
  });

  it('should display 5 content rating buttons on a row', () => {
    homePage.contentRating().should("have.length", 5);
  });

  it('should not have same parent for genre and content rating buttons', () => {
    homePage
      .genre()
      .parent()
      .should("to.not.equal", homePage.contentRating().parent());
  });

  it('should not have viewCount option selected in sort by dropdown on page load', () => {
    homePage.viewCount().should("not.to.be.selected");
  });

  it('should have releaseDate option selected in sort by dropdown on page load', () => {
    homePage.releaseDate().should("to.be.selected");
  });

  it('should have viewCount option selectable after clicking on the sort by dropdown', () => {
    homePage.sortBy().select("viewCount");
    homePage.viewCount().should("to.be.selected");
  });

  it('should have "Upload" button on landing page on load', () => {
    homePage.uploadButton().should("to.have.length.of", 1);
  });

  it('should open video modal with "Submit" and "Cancel" buttons, on clicking "Upload" button', () => {
    homePage.modalSubmitButton().should("not.to.exist");
    homePage.uploadButton().click({force: true});
    homePage.modalCancelButton().focus();
    homePage.modalSubmitButton().should("to.be.visible");
    homePage.modalCancelButton().should("to.be.visible");
  });

  it('should open video modal on clicking "Upload" button and close it on clicking "Cancel" button in the modal', () => {
    homePage.uploadButton().click({force: true});
    homePage.modalCancelButton().focus();
    homePage.modalCancelButton().should("to.be.visible");
    homePage.modalCancelButton().click({force: true});
    homePage.modalCancelButton().should("not.to.exist");
  });

  it('should have at least 10 links (with class "video-tiles-link") to different videos on page load.', () => {
    homePage.videoTileLink().should("to.have.length.of.at.least", 10);
  });

  it(
    'should display the video page on clicking the first video tile (with class "video-tile") which has a parent element with class "video-tile"' +
      'which is child of an "video-tile-link" element ',
    () => {
      let videoTileList = homePage.videoTile();
      videoTileList.should("to.have.length.of.at.least", 10);
      videoTileList.first().click({force: true});
      homePage.viewIframe().should("to.have.length.of", 1);
    }
  );
});

