import SelectedWidgetsModal from "../SelectWidgetsModal";
import styles from "./style.module.scss";

import CalendarWidget from "../CalendarWidget";
import Timer from "../Timer";
import ToDoList from "../ToDoList";
import Weather from "../Weather";

import QuoteOfTheDay from "../QuoteOfTheDay";

import NewsWidget from "../NewsWidget";
import FactOfTheDay from "../FactOfTheDay";
import SpotifyWidget from "../SpotifyWidget";

function Body({ selectedWidgets, setSelectedWidgets }) {
    return (
        <div className={styles.container}>
            {selectedWidgets && selectedWidgets.length ? (
                <div className={styles.grid}>
                    {selectedWidgets.includes("Quote Of The Day") && (
                        <div className={styles.widget}>
                            <QuoteOfTheDay />
                        </div>
                    )}
                    {selectedWidgets.includes("Fact Of The Day") && (
                        <div className={styles.widget}>
                            <FactOfTheDay />
                        </div>
                    )}
                    {selectedWidgets.includes("Spotify") && (
                        <div className={styles.widget}>
                            <SpotifyWidget />
                        </div>
                    )}
                    {selectedWidgets.includes("Calendar") && (
                        <div className={styles.widget}>
                            <CalendarWidget />
                        </div>
                    )}
                    {selectedWidgets.includes("News Widget") && (
                        <div className={styles.widget}>
                            <NewsWidget />
                        </div>
                    )}
                    {selectedWidgets.includes("Weather") && (
                        <div className={styles.widget}>
                            <Weather />
                        </div>
                    )}
                    {selectedWidgets.includes("To Do List") && (
                        <div className={styles.widget}>
                            <ToDoList />
                        </div>
                    )}
                    {selectedWidgets.includes("Timer") && (
                        <div className={styles.widget}>
                            <Timer />
                        </div>
                    )}
                </div>
            ) : (
                <div className={styles.noWidgetContainer}>
                    <div className={styles.message}>Your focus page is empty</div>
                    <div className={styles.addWidget}>
                        <SelectedWidgetsModal
                            selectedWidgets={selectedWidgets}
                            setSelectedWidgets={setSelectedWidgets}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Body;
