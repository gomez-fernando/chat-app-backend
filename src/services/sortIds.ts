export function sortIds (array: [string, string]){
    return array.sort(function (a, b) {
      return a.localeCompare(b);
      });
  }

 
  