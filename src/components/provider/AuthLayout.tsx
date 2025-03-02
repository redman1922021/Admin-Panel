import { Outlet } from "react-router-dom";
import styles from "../RegistartionLayot/RegistartionLayot.module.scss";

const AuthLayout: React.FC = () => {
    return (
        <div className={styles.registation}>
            <div className={styles.registationWrapper}>
                <div className={styles.registationLeft}>
                    <div className={styles.registationList}>
                        <img className={styles.registationImage} src="skeleton.svg" alt="skeleton"/>
                        <p className={styles.registationTitle}>Turn your ideas into reality.</p>
                        <p className={styles.registationText}>Start for free and get attractive offers from the
                            community</p>
                    </div>
                </div>
                <div className={styles.wrapperForm}>
                    <Outlet/>
                </div>
            </div>
        </div>
);
};

export default AuthLayout;
