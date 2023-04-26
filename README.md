<html> 
    <head> 
        <title> 
            Kali Linux
        </title>
    </head> 
      
    <body style = "text-align:center;">
          
        <h1 style = "color:green;" > 
            Tips, Tricks, and Documentation.
        </h1>
          
        <p id = "GFG_UP" style =
            "font-size: 19px; font-weight: bold;">
        </p>
          
        <button onclick = "GFG_Fun()">
            Enter
        </button>
          
        <p id = "GFG_DOWN" style =
            "color: green; font-size: 24px; font-weight: bold;">
        </p>
          
        <script>
            var el_up = document.getElementById("GFG_UP");
            var el_down = document.getElementById("GFG_DOWN");
              
            el_up.innerHTML = "An easy way to find resources such as "
                    + "tips, tutorials, documentation, etc all in one place.";
              
            function GFG_Fun() {
                  
                // Create anchor element.
                var a = document.createElement('a'); 
                  
                // Create the text node for anchor element.
                var link = document.createTextNode("Documentation");
                  
                // Append the text node to anchor element.
                a.appendChild(link); 
                  
                // Set the title.
                a.title = "Documentation"; 
                  
                // Set the href property.
                a.href = "https://www.kali.org/docs/"; 
                  
                // Append the anchor element to the body.
                document.body.appendChild(a); 
            }
        </script> 
    </body> 
</html>
