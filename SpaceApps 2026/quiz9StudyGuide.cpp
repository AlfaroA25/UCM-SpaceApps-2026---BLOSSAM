#include <iostream>
#include<string>
#include <vector>
using namespace std;

/*
Quiz 9 Study Guide: Vectors


1. What is a vector and How to declare one:
A vector holds many values of the same data type, size is not fixed, and it can grow or shrink as needed. You can declare a vector like this:
vector<dataType> vectorName;
Try it: Declare a vecotor of int for the passangers on each of 6 bus trips, starting with 6 elements, all 0. Declare a vector of strings that starts with "red", "green", and "blue". Print the size of each vector.

int main(){
vector<int> passengers(6); 
vector<string> colors = {"red", "green", "blue"};
cout << "Size of passengers vector: " << passengers.size() << endl;
cout << "Size of colors vector: " << colors.size() << endl;
return 0;
}



2. Reading and Changing Elements:
Every element of a vector has an index, starting at 0. You can read or change an element using its index in square brackets. You can also use the at() function to read or change an element.
Try it: Create a vector of int with 4 quiz scores: 80,90, 70, and 85. The thrid score is wrong so change it to 75, and print first score and third score again.

int main(){
    vector<int> quizScores = {80, 90, 70, 85};
    quizScores[2] = 75; // Change the third score to 75
    cout << "First score: " << quizScores[0] << endl;
    cout << "Third score: " << quizScores[2] << endl;
    return 0;
}



3. size(), and Looping Over a Vector:
To visit every element of a vector, you can use a loop. The size() function returns the number of elements in the vector. A common way to loop is to use a for loop that goes from 0 to size() - 1. 
Try it: A vector of int holds the steps walked on 5 days: 42000, 8100, 6500, 9000, and 3000. Print each value on a separate line, with its respective day. Print total number of steps at the end.

int main(){
    vector<int> steps = {4200, 8100, 6500, 9000, 3000};
    double totalSteps = 0;
    for(int i = 0; i < steps.size(); i++){
        cout << "Day " << (i + 1) << ": " << steps[i] << " steps" << endl;
        totalSteps += steps[i];
    }
    cout << "Total steps: " << totalSteps << endl;
    return 0;
}



4. Adding at the End (push_back()):
push_back() adds a new element to the end of a vector. The new element is initialized with the value you provide.
Try it:
Ask the user for 4 prices(with decimal numbers) and add them to a vector<double> that starts out empty. Then print how many prices were stored and their total.

int main(){
    vector<double> prices;
    double inputPrice;
    double totalPrice = 0;
    for(int i = 0; i < 5; i++){
        cout << "Enter price " << (i + 1) << ": ";
        cin >> inputPrice;
        prices.push_back(inputPrice); // Add the price to the vector
        totalPrice += inputPrice; // Add to total
    }
    cout << "Number of prices stored: " << prices.size() << endl;
    cout << "Total price: $" << totalPrice << endl;
    return 0;
}
    


5. Removing (pop_back() and clear()):
pop_back() removes the last element of a vector. clear() removes all elements from a vector
Try it: A vector<string> holds a playlist of 5 songs: "Intro", "Sunrise", "Echo", "Static", "Outro". The last two songs were skipped, so remove them. Print how many songs are left, then print each song. Then clear the vector and print its size again.

int main(){
    vector<string> playlist = {"Intro", "Sunrise", "Echo", "Static", "Outro"};
    cout << "Playlist size: " << playlist.size() << endl;
    playlist.pop_back();
    playlist.pop_back();

    cout<< "Playlist after pop_back: " << playlist.size() << endl;
    for(int i = 0; i < playlist.size(); i++){
        cout << playlist[i] << endl;
    }
    playlist.clear();
    cout << "Playlist after clear: " << playlist.size() << endl;

    return 0;
}



6. Peeking (empty() and front() and back()):
3 small functions let you peek at a vector without changing it. empty() returns true if the vector has no elements, front() returns the first element, and back() returns the last element.
Try it. A vector<int> holds the lengths of recent bike rides in minutes. Print the first ride and the last
ride, but print No rides if the vector is empty. Test your code twice: once with the values 25, 40, 15 and
once with an empty vector.

int main() {
    vector<int> bikeRides = {25, 40, 15}; 

    if (bikeRides.empty()) {
        cout << "No rides" << endl;
    } else {
        cout << "First ride: " << bikeRides.front() << " minutes" << endl;
        cout << "Last ride: " << bikeRides.back() << " minutes" << endl;
    }
    return 0;
}
    


7. Positions and insert():
some vector functions let you add or remove elements at specific positions. insert() adds a new element at a specified position, and erase() removes an element from a specified position. The position is given as an iterator, which is a pointer to the element. You can get an iterator to the first element with begin(), and to the last element with end(). To get an iterator to a specific index, you can add the index to begin().
Try it. A vector<int> holds the sorted lucky numbers 3, 7, 12, 20. Insert 9 so the numbers stay in order,
and insert 1 at the very beginning. Then print all the numbers on one line.

int main() {
    vector<int> luckyNum = {3,7, 12, 20};
    luckyNum.insert(luckyNum.begin() + 2, 9); // Insert 9 at index 2
    luckyNum.insert(luckyNum.begin(), 1); // Insert 1 at index 0
    for (int i = 0; i < luckyNum.size(); i++) {
        cout << luckyNum[i] << " "; // Print each number
    }
    return 0;
}



8. Removing from the Middle (erase()):
erase() removes an element from a specified position. The position is given as an iterator, which is a pointer to the element. You can get an iterator to the first element with begin(), and to the last element with end(). To get an iterator to a specific index, you can add the index to begin().
Try it. A vector<string> holds the shopping list “milk”, “eggs”, “rice”, “jam”, “tea”. Remove “eggs”
(use its index) and remove the last item. Then print the remaining items on one line.

int main() {
    vector<string> shoppingList = {"milk", "eggs", "rice", "jam", "tea"};
    shoppingList.erase(shoppingList.begin() + 1); // Remove "eggs" at index 1
    shoppingList.erase(shoppingList.end() - 1); // Remove the last item ("tea")
    for (int i = 0; i < shoppingList.size(); i++) {
        cout << shoppingList[i] << " "; // Print remaining items
    }
    return 0;
}



9. Passing a Vector to a Function:
You can pass a vector to a function by reference, so the function can change the original vector
Try it. Write a function called applyDiscount that subtracts 5 from every price in a vector of int ticket
prices, so that the code that called it sees the lower prices. In main, create the prices 20, 35 and 50, call
the function once, and print the three prices.

void applyDiscount(vector < int>& prices) {
    for (int i = 0; i < prices.size(); i++) {
        prices[i] -= 5; // Subtract 5 from each price
    }
}
void printPrices(const vector<int>& prices) {
    for (int i = 0; i < prices.size(); i++) {
        cout << prices[i] << endl; // Print each price
    }
}
int main(){
    vector<int> ticketPrices = {20, 35, 50};
    cout << "Original prices: " << endl;
    printPrices(ticketPrices); // Print original prices

    cout << "Prices after discount: " << endl;
    applyDiscount(ticketPrices); // Call the function to apply discount
    printPrices(ticketPrices); // Print prices after discount

    return 0;
}



10. Arrays vs. Veoctors: Quick Reference
Arrays and vectors side by side:
Operation            Array                  Vector
Declare              int a[5];              vector<int> v(5);
Size                 a separate variable    v.size()
Add at the end       not possible           v.push_back(x)
Remove the last      not possible           v.pop_back()
Insert or erase      shift by hand          v.insert(...) v.erase(...)
Pass to a function   changes the original   a copy, unless you use &

Vector member functions. The i is an index and x is a value:

Function                What it does
v.size()                how many elements it holds
v.empty()               true when it holds nothing
v[i]                    element i, not checked
v.at(i)                 element i, checked
v.front() v.back()      the first and the last element
v.push_back(x)          add x at the end
v.pop_back()            remove the last element
v.insert(v.begin() + i, x) put x at index i; later ones shift right
v.erase(v.begin() + i)  remove index i; later ones shift left
v.clear()               remove every element

*/


