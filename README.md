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

### Steps to completion:

- [x]  Add dog to dogs root collection
- [x]   Setup Firebase Cloud Function™ to listen for new (***ON CREATE***) dogs. When a new dog is added to the collection, use Cloud Functions to add that dog to the dogs property on the user record.

^^Coming back here to work on this. 

Having lots of trouble getting this cloud function right. I think it may have had something to do with undefined data somewhere...

Jesus Christ. That took way too long to figure out.

Some gotchas:
- I changed from using onWrite to onCreate for dogs and the parameters changed. Since cloud function logs are, well, cloud function logs, it took way too much time to figure that out. Using Chris Esplin's approach that I've got somewhat working (I think) in Knophy, would be a much better idea.
![https://i.imgur.com/GxidGUn.png](https://i.imgur.com/GxidGUn.png)
HALLELUJAH!! it's working
- [ ]    Keep everything up to date (***ON WRITE***). Things that can change: user names, user profile pictures, user descriptions, dog pictures. When properties change, propagate those changes to each respective record.

^^ Need to test, but I believe this works
**For example**

  Actually, I'm going to go ahead and just do the add part first to keep things relatively simple at first.

  
  Now, it's time to test and see how much I got wrong...
  
### ERRORS
#### ERROR 1
![Cannot read property 'length' of undefined"](https://i.imgur.com/17MZhaX.png" "Cannot read property 'length' of undefined")

I know how to fix this one. I didn't check if the dog array property actually exists on the user object. Going to go fix that now.
I think that was fixed :)

#### ERROR 2

![Searching for a dog I just added"](https://i.imgur.com/stmhDX3.png" "Searching for a dog that I just added")


#### ERROR 3
![Probably missing Firestore index](https://i.imgur.com/sPSLe1u.png)
I am almost positive this error has to do with a missing index on Firestore, but I'm really not sure how to fix it. Maybe it's seeing that collectionGroup query still? Not sure. Will have to come back. I want to make a PR for react-native-firebase to show those URLs...
Fixed it!

Also realized that I need to figure out case insensitive search, so fixing that real quick.

Not sure why I inserted this.
![insert image alt text here](https://i.imgur.com/z0ZBSnq.png)


#### ERROR N
![insert image alt text here](insert_image_url_here)
