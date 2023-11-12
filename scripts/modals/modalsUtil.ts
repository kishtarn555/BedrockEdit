
export function getInteger(value:string, range?:[number,number]): number | undefined {
     // Convert the input value to a number
     const parsedValue = Number(value);

     // Check if the parsedValue is a valid number and an integer
     if (!Number.isInteger(parsedValue) || isNaN(parsedValue)) {
         return undefined;
     }
 
     // Check if the value is within the specified range (if provided)
     if (range !== undefined && (parsedValue < range[0] || parsedValue > range[1])) {
         return undefined;
     }
 
     // Return the valid integer value
     return parsedValue;
}