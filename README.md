#README

I'm going to start a simple README to explain my reasoning for various decisions for modeling my data the way I am. 

Over time, these decisions may inevitably change, but hopefully the motivation will be tracked through this document.

## Dogs
### Requirements
One of the requirements of this project is that a user can add an arbitrary amount of dogs.
No biggie.

Another requirement however, is that users must be able to search for dogs by their name. This throws a wrench into things slightly. 

One final requirement that has my head in knots as to how to model the NoSQL (I'm stuck in Firebase, my own decision) data is that we also need to be able to query for *NEARBY* dogs.

Now, I think I have at least what will be my initial attempt at modeling the data.

OH, one last thing - when searching for users, we want to display all dogs that the user owns in the search result, and when the user searches for a dog, the dog's user will be displayed in the search result as well.

### Solution 
Dogs need to be the following:

| Need        | Reasoning           | Caveats           |
| ------------- |-------------|-------------|
| An array property of the user | In order to show all a user's dogs in the search results, we want to be able to query for the "complete" user object (containing its dogs) with one query. |  We cannot search all dog names if they are only stored in a property on each respective user record. 
| Stored in their own root collection   | In order to search for dog names and to locate a dog by its ID without collectionGroup queries, dogs need to be stored in their own collection.       | We cannot display all of a user's dogs in search results without making an additional query for each dog that user owns.   |

Now, off to it!
