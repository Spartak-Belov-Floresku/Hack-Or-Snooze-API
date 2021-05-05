"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// checking if form of new story is visible or not

function showSubmitNewStoryForm(){
  console.debug("SubminNewStoryForm");

  $allStoriesFivoriteList.hide();
  $storiesMyList.hide();
  hidePageComponents();
  putStoriesOnPage();
  
  $formSubmitNewStory.css('display') === "none"?$formSubmitNewStory.show(100):$formSubmitNewStory.hide(100);
}

$linkSubmitNewStory.on('click', showSubmitNewStoryForm);

// popup and fillout separate list of favorite stories

function showFivoriteStories(){
  
  console.debug("showFivoriteStories");
  $allStoriesFivoriteList.empty();
  $formSubmitNewStory.hide();
  $storiesMyList.hide();
  hidePageComponents();

  const favorites = currentUser.favorites;
  for(let story of favorites){
    const st = generateStoryMarkup(story);
    $allStoriesFivoriteList.append(st);
  }

  if(favorites.length <= 0){
    $allStoriesFivoriteList.append('<p>No favorites added!</p>')
  }

  if($allStoriesFivoriteList.css('display') === "none"){
    $allStoriesFivoriteList.show(100);
      $allStoriesList.hide();
  }else{
    $allStoriesFivoriteList.hide(100);
      $allStoriesList.show();
  }
}

$navFavorites.on('click', showFivoriteStories);


//popup all user's stroy

function showUserStories(){
  const storyUser = storyList.stories.filter(story => story.username === currentUser.username);

  $storiesMyList.empty();
  $formSubmitNewStory.hide();
  $allStoriesFivoriteList.hide();
  hidePageComponents();

  for(let story of storyUser){
    const st = generateStoryMarkup(story);
    $storiesMyList.append(st);
  }

  if(storyUser.length <= 0){
    $storiesMyList.append('<p>No stories added by user yet!</p>')
  }

  if($storiesMyList.css('display') === "none"){
    $storiesMyList.show(100);
      $allStoriesList.hide();
  }else{
    $storiesMyList.hide(100);
      $allStoriesList.show();
  }
}

$navMyStories.on('click', showUserStories);