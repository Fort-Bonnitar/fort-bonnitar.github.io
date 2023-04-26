<!DOCTYPE HTML> 
<html> 
    <head> 
        <title> 
            Kali Linux Documentation
            <meta http-equiv='refresh' content='0; URL=https://www.kali.org/docs/'>
        </title>
    </head> 
      
    <body style = "text-align:center;">
          
        <h1 style = "color:green;" > 
            GeeksForGeeks
        </h1>
          
        <p id = "GFG_UP" style =
            "font-size: 19px; font-weight: bold;">
        </p>
          
        <button onclick = "GFG_Fun()">
            click here
        </button>
          
        <p id = "GFG_DOWN" style =
            "color: green; font-size: 24px; font-weight: bold;">
        </p>
          
        <script>
            var el_up = document.getElementById("GFG_UP");
            var el_down = document.getElementById("GFG_DOWN");
              
            el_up.innerHTML = "Kali Linux Documentation.";
              
            function GFG_Fun() {
                  
                // Create anchor element.
                var a = document.createElement('a'); 
                  
                // Create the text node for anchor element.
                var link = document.createTextNode("This is link");
                  
                // Append the text node to anchor element.
                a.appendChild(link); 
                  
                // Set the title.
                a.title = "This is Link"; 
                  
                // Set the href property.
                a.href = "https://www.geeksforgeeks.org"; 
                  
                // Append the anchor element to the body.
                document.body.appendChild(a); 
            }
        </script> 
    </body> 
</html>
