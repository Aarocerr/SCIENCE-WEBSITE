var codeTexts = {
    'ChangeToGlass.cs': `
    using UnityEngine;
    using UnityEngine.UI;
    
    public class ChangeToGlass : MonoBehaviour
    {
        public ScienceProjectScript scienceProjectScript;
    
        void Start()
        {
            Button button = GetComponent<Button>();
            button.onClick.AddListener(OnClick);
        }
    
        void OnClick()
        {
            scienceProjectScript.material = "glass";
        }
    }
    // when you press glassButton it runs this script which changes the value of variable 'material' of class 'scienceProjectScript' to 'glass'`,

    'ChangeToWater.cs': `
    using UnityEngine;
    using UnityEngine.UI;

    public class ChangeToWater : MonoBehaviour
    {
        public ScienceProjectScript scienceProjectScript;

        void Start()
        {
            Button button = GetComponent<Button>();
            button.onClick.AddListener(OnClick);
        }

        void OnClick()
        {
            scienceProjectScript.material = "water";
        }
    }
    // when you press waterButton it runs this script which changes the value of variable 'material' of class 'scienceProjectScript' to 'water'
    `,

    'QuitGame.cs': `
    using System.Collections;
    using System.Collections.Generic;
    using UnityEngine;

    public class quitGame : MonoBehaviour
    {
        public void QuitGame()
        {
            Application.Quit();
        }
    }
    // script is attached to quitButton -- essentially just an onclick event which runs "Application.Quit();" which, as you could've guessed, quits the application
    `,
    'ScienceProjectScript.cs': `
    using System.Collections;
    using System.Collections.Generic;
    using UnityEngine;

    public class ScienceProjectScript : MonoBehaviour
    {
        public GameObject lightRay; // incident ray
        public GameObject refractedRay;
        public GameObject reflectedRay;
        public GameObject backgroundWater; // object representing the water background
        public GameObject backgroundGlass; // object representing the glass background
        public Rigidbody2D rbIncident; // accesses the physics of lightRay to be transformed later
        public Rigidbody2D rbRefracted; // accesses the physics of refractedRay to be transformed later
        public Rigidbody2D rbReflected; // accesses the physics of reflectedRay to be transformed later
        const float n1 = 1.0f; // refractive index of a vacuum -- set as constant
        float n2;
        float angleInc2; // AKA: theta 2
        public float angleInc1 = 0.0f; // AKA: theta 1 -- changeable by user with slider
        public string material = "glass"; // this is a public string that can be set to 'water' or 'glass' by the user to change the value of n2
        bool addWaterBackgroundAction;
        bool addGlassBackgroundAction;
        bool waterBackgroundHasBeenAdded;
        bool glassBackgroundHasBeenAdded;

        void Start()
        {
            // defines the physics of GameObjects
            rbIncident = lightRay.GetComponent<Rigidbody2D>();
            rbRefracted = refractedRay.GetComponent<Rigidbody2D>();
            rbReflected = reflectedRay.GetComponent<Rigidbody2D>();
        }

        void Update()
        {
            // sets value of n2 based on what user sets variable 'material' to
            if (material == "water" && !waterBackgroundHasBeenAdded)
            {
                n2 = 1.33f; // angle of incidence of water
                addWaterBackgroundAction = true;
                SummonBackground();
                addGlassBackgroundAction = false;
                glassBackgroundHasBeenAdded = false;
            }
            else if (material == "glass" && !glassBackgroundHasBeenAdded)
            {
                n2 = 1.52f; // angle of incidence of glass
                addGlassBackgroundAction = true;
                SummonBackground();
                addWaterBackgroundAction = false;
                waterBackgroundHasBeenAdded = false;
            }

            angleInc1 = Mathf.Clamp(angleInc1, -48.75f, 48.75f); // clamps the rotation to not go over 48.75 or under -48.75 values -- anything more seems to cause errors. This is mostly for testing purposes, as when the slider is inputted, this line of code isn't needed anymore
            angleInc2 = angleInc2 = Mathf.Asin((n1 / n2) * Mathf.Sin(angleInc1 * Mathf.Deg2Rad)) * Mathf.Rad2Deg; // calculates theta 2

            rbIncident.transform.rotation = Quaternion.Euler(0, 0, angleInc1);
            rbRefracted.transform.rotation = Quaternion.Euler(0, 0, angleInc2);
            rbReflected.transform.rotation = Quaternion.Euler(0, 0, -angleInc1); // negative value of angleInc1 should do fine for reflected angle
        }

        public void AdjustIncidentAngle(float angle)
        {
            angleInc1 = angle;
            // this is for the slider. This function is attached to the slider, and when you change the value of the slider it corresponds to the variable 'angle'. We then change 'angle' to be equal to 'angleInc1' to make the slider work
        }

        void SummonBackground()
        {
            if (addWaterBackgroundAction)
            {
                Instantiate(backgroundWater, backgroundWater.transform.position, backgroundWater.transform.rotation); // adds water background which is set to a GameObject variable type
                waterBackgroundHasBeenAdded = true;
                addGlassBackgroundAction = false;
            }
            if (addGlassBackgroundAction)
            {
                Instantiate(backgroundGlass, backgroundGlass.transform.position, backgroundGlass.transform.rotation); // adds glass background which is set to a GameObject variable type
                glassBackgroundHasBeenAdded = true;
                addGlassBackgroundAction = false;
            }
        }
    }
    // brains and logic of whole program
    `,
    'README.md': `
    Snell-s-Law-Science-Project
    ALL FOUR UNITY C# SCRIPTS FOR SCIENCE PROJECT BY AARON:

    ScienceProjectScript: This is the whole brains and logic of the program. It contains all of the calculations for Snell's Law.

    ChangeToWater: Essentially just handles the 'water' button so that when you press it, the variable 'material' in class 'ScienceProjectScript' is set to 'water'

    ChangeToGlass: Does the same as 'ChangeToWater' class but instead changes string variable 'materal' to 'glass', NOT 'water'

    QuitGame: Handles the quit button. When you press it, it runs the code 'Application.Quit();' which stops the program from running.

    IMPROVEMENTS: One thing that would've made the code better is making it so when you spawn 'backgroundGlass' it would delete the previous 'backgroundWater', and vice versa. This would've made the code more lag efficient. Also, the script uses a little too many comments for my liking making it redundant, but considering it's a school project, it's not too bad (I hope).
    `
};

function changeCode(filename) {
    var codeElement = document.getElementById("code_text");
    codeElement.textContent = codeTexts[filename];
}
