import { useEffect, useState } from "react";
import "./App.css";

export type PromptSnippetMap = Record<string, string>;
export type promptSkeleton = {
  camera: CameraSettingsType;
  environment: EnvironmentSettingsType;
  design: DesignSettingsType;
  entourage: EntourageSettingsType;
};
export type CameraSettingsType = {
  style: string;
  projection: string;
  angle: string;
};
export type EnvironmentSettingsType = {
  season: string;
  weather: string;
  time: string;
};
export type DesignSettingsType = {
  exterior: string;
  interior: string;
  foreground: string;
  background: string;
};
export type EntourageSettingsType = {
  vegetation: string[];
  people: string[];
  amount: string;
  additional: string[];
};
const vegetationOptions = [
  { value: "asset-vegetation-lawn", label: "Lawn" },
  { value: "asset-vegetation-flower", label: "Flower" },
  { value: "asset-vegetation-bush", label: "Bush" },
];
const peopleOptions = [
  { value: "asset-people-business", label: "Business" },
  { value: "asset-people-casual", label: "Casual" },
  { value: "asset-people-elderly", label: "Elderly" },
  { value: "asset-people-children", label: "Children" },
];
const additionalOptions = [
  { value: "asset-additional-street-props", label: "Street Props" },
  { value: "asset-additional-ref-image", label: "Reference Image" },
];
const defaultCameraSettings: CameraSettingsType = {
  style: "camera-sketch",
  projection: "camera-projection-street",
  angle: "na",
};

const defaultEnvironmentSettings: EnvironmentSettingsType = {
  season: "environment-season-spring",
  weather: "environment-weather-sunny",
  time: "environment-time-morning",
};

const defaultDesignSettings: DesignSettingsType = {
  exterior: "design-exterior-res",
  interior: "design-interior-res-unit",
  foreground: "na",
  background: "na",
};

const defaultEntourageSettings: EntourageSettingsType = {
  vegetation: [],
  people: [],
  amount: "na",
  additional: [],
};

const generatePrompt = (
  skeleton: promptSkeleton,
  snippetMap: PromptSnippetMap,
) => {
  const selectedKeys = [
    skeleton.camera.style,
    skeleton.camera.angle,
    skeleton.camera.projection,
    skeleton.environment.season,
    skeleton.environment.weather,
    skeleton.environment.time,
    skeleton.design.exterior,
    skeleton.design.interior,
    skeleton.design.background,
    skeleton.design.foreground,
    ...skeleton.entourage.vegetation,
    ...skeleton.entourage.people,
    skeleton.entourage.amount,
    ...skeleton.entourage.additional,
  ];
  const promptString = selectedKeys
    .filter((key) => key !== "na")
    .map((key) => snippetMap[key])
    .filter((snippet) => snippet !== undefined && snippet.trim() !== "")
    .join(" ");
  return promptString;
};

function App() {
  const resetSelection = () => {
    setCamSettings(defaultCameraSettings);
    setDesignSettings(defaultDesignSettings);
    setEntourageSettings(defaultEntourageSettings);
    setEnvSettings(defaultEnvironmentSettings);
  };
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy to clipboard - manually copy prompt", err);
    }
  };
  useEffect(() => {
    fetch("/prompt-generator/prompt-snippet-map.json")
      .then((res) => res.json())
      .then((data) => setSnippetMap(data));
  }, []);
  const [copied, setCopied] = useState<boolean>(false);
  const [snippetMap, setSnippetMap] = useState<PromptSnippetMap>({});
  const [camSettings, setCamSettings] = useState<CameraSettingsType>(
    defaultCameraSettings,
  );
  const [envSettings, setEnvSettings] = useState<EnvironmentSettingsType>(
    defaultEnvironmentSettings,
  );
  const [designSettings, setDesignSettings] = useState<DesignSettingsType>(
    defaultDesignSettings,
  );

  const [entourageSettings, setEntourageSettings] =
    useState<EntourageSettingsType>(defaultEntourageSettings);
  const [prompt, setPrompt] = useState<string>("");
  return (
    <div>
      <h1>Prompt-Generator</h1>
      <form
        className="prompt-form"
        onSubmit={(e) => {
          e.preventDefault();
          const skeleton: promptSkeleton = {
            camera: camSettings,
            environment: envSettings,
            entourage: entourageSettings,
            design: designSettings,
          };
          setPrompt(generatePrompt(skeleton, snippetMap));
        }}
      >
        <div className="basic-selection">
          {/*Camera Settings Options*/}
          <fieldset className="selection-group">
            <legend className="selection-title">Camera Settings</legend>

            <label htmlFor="style">Style Transfer</label>
            <select
              className="option-selection"
              id="style"
              value={camSettings.style}
              onChange={(e) =>
                setCamSettings((prev) => ({ ...prev, style: e.target.value }))
              }
            >
              <option value={"na"}>--- Not Required ---</option>

              <option value="camera-sketch">Sketch</option>
              <option value="camera-marker">Marker</option>
              <option value="camera-watercolor">Watercolor</option>
              <option value="camera-photorealism">Photorealism</option>
              <option value="camera-ref-image">Reference Image</option>
            </select>

            <label htmlFor="projection">Projection</label>
            <select
              className="option-selection"
              id="projection"
              value={camSettings.projection}
              onChange={(e) =>
                setCamSettings((prev) => ({
                  ...prev,
                  projection: e.target.value,
                }))
              }
            >
              <option value={"na"}>--- Not Required ---</option>

              <option value="camera-projection-street">
                Street Perspective
              </option>
              <option value="camera-projection-aerial">Aerial</option>
              <option value="camera-projection-plan">Plan</option>
              <option value="camera-projection-isometric">Isometric</option>
            </select>

            <label htmlFor="angle">Camera Angle</label>
            <select
              className="option-selection"
              id="angle"
              value={camSettings.angle}
              onChange={(e) =>
                setCamSettings((prev) => ({ ...prev, angle: e.target.value }))
              }
            >
              <option value={"na"}>--- Not Required ---</option>
              <option value="camera-angle-left">Move Left</option>
              <option value="camera-angle-right">Move Right</option>
              <option value="camera-angle-up">Move Up</option>
              <option value="camera-angle-down">Move Down</option>
            </select>
          </fieldset>

          {/*Environment Options*/}
          <fieldset className="selection-group">
            <legend className="selection-title">Environment Settings</legend>

            <label htmlFor="season">Season</label>
            <select
              className="option-selection"
              id="season"
              value={envSettings.season}
              onChange={(e) =>
                setEnvSettings((prev) => ({ ...prev, season: e.target.value }))
              }
            >
              <option value={"na"}>--- Not Required ---</option>

              <option value="environment-season-spring">Spring</option>
              <option value="environment-season-summer">Summer</option>
              <option value="environment-season-fall">Fall</option>
              <option value="environment-season-winter">Winter</option>
            </select>

            <label htmlFor="time">Time Of Day</label>
            <select
              className="option-selection"
              id="time"
              value={envSettings.time}
              onChange={(e) =>
                setEnvSettings((prev) => ({ ...prev, time: e.target.value }))
              }
            >
              <option value={"na"}>--- Not Required ---</option>
              <option value="environment-time-morning">Morning</option>
              <option value="environment-time-noon">Noon</option>
              <option value="environment-time-afternoon">Afternoon</option>
              <option value="environment-time-night">Night</option>
            </select>

            <label htmlFor="weather">Weather</label>
            <select
              className="option-selection"
              id="weather"
              value={envSettings.weather}
              onChange={(e) =>
                setEnvSettings((prev) => ({ ...prev, weather: e.target.value }))
              }
            >
              <option value={"na"}>--- Not Required ---</option>
              <option value="environment-weather-sunny">Sunny</option>
              <option value="environment-weather-cloudy">Cloudy</option>
              <option value="environment-weather-raining">Raining</option>
              <option value="environment-weather-snowing">Snowing</option>
            </select>
          </fieldset>

          {/*Design Options*/}
          <fieldset className="selection-group">
            <legend className="selection-title">Design</legend>

            <label htmlFor="exterior">Exterior Type</label>
            <select
              className="option-selection"
              id="exterior"
              value={designSettings.exterior}
              onChange={(e) =>
                setDesignSettings((prev) => ({
                  ...prev,
                  exterior: e.target.value,
                }))
              }
            >
              <option value={"na"}>--- Not Required ---</option>
              <option value="design-exterior-res">Residential</option>
              <option value="design-exterior-comm">Commercial</option>
              <option value="design-exterior-retail">Retail</option>
              <option value="design-exterior-urban-plaza">Urban Plaza</option>
              <option value="design-exterior-ref-image">Reference Image</option>
            </select>

            <label htmlFor="interior">Interior Type</label>
            <select
              className="option-selection"
              id="interior"
              value={designSettings.interior}
              onChange={(e) =>
                setDesignSettings((prev) => ({
                  ...prev,
                  interior: e.target.value,
                }))
              }
            >
              <option value={"na"}>--- Not Required ---</option>
              <option value="design-interior-res-unit">Residential Unit</option>
              <option value="design-interior-res-lobby">
                Residential Lobby
              </option>
              <option value="design-interior-comm-lobby">
                Commercial Lobby
              </option>
              <option value="design-interior-comm-office">
                Commercial Office
              </option>
              <option value="design-interior-food-bev">Food & Beverage</option>
              <option value="design-interior-ref-image">Reference Image</option>
            </select>

            <label htmlFor="foreground">Foreground</label>
            <select
              className="option-selection"
              id="foreground"
              value={designSettings.foreground}
              onChange={(e) =>
                setDesignSettings((prev) => ({
                  ...prev,
                  foreground: e.target.value,
                }))
              }
            >
              <option value={"na"}>--- Not Required ---</option>
              <option value="design-fore-urban">Urban Street</option>
              <option value="design-fore-landscape">Landscape</option>
            </select>

            <label htmlFor="background">Background</label>
            <select
              className="option-selection"
              id="background"
              value={designSettings.background}
              onChange={(e) =>
                setDesignSettings((prev) => ({
                  ...prev,
                  background: e.target.value,
                }))
              }
            >
              <option value={"na"}>--- Not Required ---</option>
              <option value="design-back-sky">Sky</option>
              <option value="design-back-landscape">Landscape</option>
              <option value="design-back-urban">Urban Skyline</option>
            </select>
          </fieldset>

          {/*Entourage Options*/}
          <fieldset className="selection-group">
            <legend className="selection-title">Entourage</legend>
            <div className="sub-group-title">Add Vegetation</div>
            <div className="multi-selection-group">
              {vegetationOptions.map((option) => (
                <label key={option.value}>
                  <input
                    type="checkbox"
                    checked={entourageSettings.vegetation.includes(
                      option.value,
                    )}
                    onChange={(e) =>
                      setEntourageSettings((prev) => ({
                        ...prev,
                        vegetation: e.target.checked
                          ? [...prev.vegetation, option.value]
                          : prev.vegetation.filter(
                              (item) => item !== option.value,
                            ),
                      }))
                    }
                  />
                  {option.label}
                </label>
              ))}
            </div>

            <div className="sub-group-title">Add People</div>
            <div className="multi-selection-group">
              {peopleOptions.map((option) => (
                <label key={option.value}>
                  <input
                    type="checkbox"
                    checked={entourageSettings.people.includes(option.value)}
                    onChange={(e) =>
                      setEntourageSettings((prev) => ({
                        ...prev,
                        people: e.target.checked
                          ? [...prev.people, option.value]
                          : prev.people.filter((item) => item !== option.value),
                      }))
                    }
                  />
                  {option.label}
                </label>
              ))}
            </div>

            <label htmlFor="amount">People Amount</label>
            <select
              className="option-selection"
              id="amount"
              value={entourageSettings.amount}
              onChange={(e) =>
                setEntourageSettings((prev) => ({
                  ...prev,
                  amount: e.target.value,
                }))
              }
            >
              <option value={"na"}>--- Not Required ---</option>
              <option value="asset-people-amount-few">Few</option>
              <option value="asset-people-amount-some">Some</option>
              <option value="asset-people-amount-many">Many</option>
            </select>

            <div className="sub-group-title">Additional Assets</div>
            <div className="multi-selection-group">
              {additionalOptions.map((option) => (
                <label key={option.value}>
                  <input
                    type="checkbox"
                    checked={entourageSettings.additional.includes(
                      option.value,
                    )}
                    onChange={(e) =>
                      setEntourageSettings((prev) => ({
                        ...prev,
                        additional: e.target.checked
                          ? [...prev.additional, option.value]
                          : prev.additional.filter(
                              (item) => item !== option.value,
                            ),
                      }))
                    }
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="button-group">
            <button type="submit" className="submit-button">
              Generate
            </button>
            <button
              type="button"
              onClick={resetSelection}
              className="submit-button"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="submit-area">
          <fieldset>
            <legend className="selection-title">Generated Prompt</legend>
            <p className="generated-prompt">{prompt}</p>
            <button
              type="button"
              className="copy-button"
              onClick={copyToClipboard}
              disabled={prompt === ""}
            >
              {copied ? "Copied to Clipboard" : "Copy to Clipboard"}
            </button>
          </fieldset>
        </div>
      </form>
    </div>
  );
}

export default App;
