## What does the SiteMap look like?
* Landing Page
* Login Page
* Register Page
* Loading Screen
  * Take creative liberties here, but render this page while "/get-character" is loading.
* Character Page
    * Render Loading page while we hit "/get-character". The response will contain `{hasCharacter: boolean}`
    * Character Selection Page (hasCharacter == false):
        * I'd like to see an area that's a dotted line, curved rectangle (border radius) with a "+" icon in the center and the text "Create Character". If the user clicks on this
        * Once the user clicks on "Create Character" render a character creations screen. The can select the their portrait from a dropdown list of images. Whatever they select, render it large, inside the card. Also, in the card will be their starting stats. These portraits can be found here in "/public/images/portraits. Please include all of them in the dropdown, but for now, only "elf", "Drake", and "Arc-mage" can be used. If the player chooses one of the other portraits, render the image as normal, except add a "Locked" overlay to the image and prevent the user from clicking "Create Character".
    * Character Selection Page (hasCharacter == true)
        * This is simple, just make a giant card that has their character's current stats on it. Again, as "Dark Fantasy" as possible. Take inspiration from "Mork Borg", "Elden Ring", and "Buriedbornes". Once the user clicks on their character, bring then to "/exploration" and render their stats on the card.
    * I'd like a single source of truth while we mock this, so please make a CharacterContext. This is what will call "/get-character" and it will store all the character's current data to be used in any child component.
* [Map Exploration Page](exploration_collapsed.png)
  * Explanation: (/exploration)
    * This page consists of three windows:
      * Top left Pane: A Higher Order Component called Description that houses the player's current map location description or current interaction. At the top it will have either "Location Icon and 'Location'" or "Event Icon and 'Event'". This component will also have a "ButtonContainer" section, and whatever components are children of this <Description> (top left pane) component, will render as buttons at the bottom left/
      * Top Right Pane: For now, this will just be a "Image". What I'd like to see is that this "Map" use a useMapLocation Hook that get's the player's current location and then renders a specific map based on that information. For now, just have it be an image with a custom hook that just returns which image to render. For now, just use whatever picsum link you'd like.
      * Bottom Pane: This will contain the character's portrait, name, Max Hit Points, Current Hitpoints, Max Mind Points, Current Mind Points, an experience bar with current and amount needed to level up, three stats "Body", "Mind", and "Heart" with their respective values. I would like this pane to be clickable as it will expand and collapse. [This image is the collapsed version](exploration_collapsed.png) and [This image is the expanded version](exploration_expanded.png). Lastly, there's the the tooltip in the lower left hand corner of this pane. For now, fill it with a list of Lorum Ipsum, but it will eventually contain all stats and mechanics of the game.
* [Combat Page](combat.png)
  * Top pane will have the enemy's portrait, Name, Current, and max HP.
  * Middle Pane will have the updated log of the battle. The results of each turn will be put in here. For now, just lorem ipsum
  * Bottom Pane
  * Left Pane: Current Character's portrait, Name, Level, current HP, Max HP, current MP, and max MP. There'll be trhee buttons inside this card: Body, Mind, Heart. Each one of these, when clicked, will change the color of the "Attack/defend/Sp. Atk buttons. This is because if you look at the game-documentation, a player has to select the "move type" first, then their action. So for instance, they click Body, then Attack. Depending on if they chose Body, Mind, or HEart, either the player is at an advantage (ie. Body > Mind), Equal (ie. Body > Body), or Disadvantage (ie. Body > Heart).