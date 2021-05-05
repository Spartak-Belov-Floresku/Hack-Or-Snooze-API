"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  //console.debug("generateStoryMarkup", story);

  /*
  check if the user logged in to set up a checkbox, if the story is favorited, 
  and if story is the user's story to set up a remove span tag
  */
  
  let checked = false;
  let remove = false;
  
  if(currentUser){
    if(currentUser.favorites.length > 0){
      checked = currentUser.favorites.some(el => el.storyId === story.storyId);
    }
    if(story.username === currentUser.username){
      remove= true;
    }
  }
 
  const hostName = story.getHostName();

  return $(`
            <li id="${story.storyId}">
              ${remove === true? '<span class="remove">X</span>':''}
              ${checked === true? `<input type="checkbox" class="favor" checked>`:``}
              ${currentUser !== undefined && checked === false? `<input type="checkbox" class="favor">`:``}
              <a href="${story.url}" target="a_blank" class="story-link">
                ${story.title}
              </a>
              <small class="story-hostname">(${hostName})</small>
              <small class="story-author">by ${story.author}</small>
              <small class="story-user">posted by ${story.username}</small>
            </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");
  $formSubmitNewStory.hide(100);
  $allStoriesFivoriteList.hide(100);
  $storiesMyList.hide(100);
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// send a new story to the server updated list of stories

async function submitNewStory(e){
  console.debug("submitNewStory");
  e.preventDefault();

  const author = $("#author").val();
  const title = $("#title").val();
  const url = $("#url").val();

  await storyList.addStory(currentUser, {title, author, url});
  storyList = await StoryList.getStories();

  $allStoriesList.empty();
  $formSubmitNewStory.trigger("reset");
  $formSubmitNewStory.hide(200)

  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
}

$formSubmitNewStory.on("submit", submitNewStory);


//add or delete favorite story for the current user

async function addDeleteFavoriteStory(e){
  const strId = $(e.target).parent().attr('id');
    const story = storyList.stories.find(el => el.storyId === strId);
      $(e.target).is(':checked')? await currentUser.addFavorMethod(story): await currentUser.deleteFavorMethod(story);
}

$storiesList.on("change", $('.favor'), addDeleteFavoriteStory);


// delete user's story fomr DOM and server

async function deleteUserStory(e){

  if(e.target.nodeName !== "SPAN") return;

  const storyId = $(e.target).parent().attr('id');

  await currentUser.deleteUserStory(storyId);
  storyList = await StoryList.getStories();

  $storiesMyList.empty();
  const storyUser = storyList.stories.filter(story => story.username === currentUser.username);

  for (let story of storyUser) {
    const $story = generateStoryMarkup(story);
    $storiesMyList.append($story);
  }

  if(storyUser.length <= 0){
    $storiesMyList.append('<p>No stories added by user yet!</p>')
  }

}

$storiesMyList.on("click",$('.remove'), deleteUserStory);
