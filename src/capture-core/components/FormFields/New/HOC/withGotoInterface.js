//
import * as React from "react";

export const withGotoInterface = () => InnerComponent =>
    class GotoFieldInterface extends React.Component {
        goto() {
            if (this.gotoInstance) {
                this.gotoInstance.scrollIntoView();

                const scrolledY = window.scrollY;
                if (scrolledY) {
                    // TODO: Set the modifier some other way (caused be the fixed header)
                    window.scroll(0, scrolledY - 48);
                }
            }
        }

        render() {
            return (
                <div
                    ref={gotoInstance => {
                        this.gotoInstance = gotoInstance;
                    }}
                >
                    <InnerComponent {...this.props} />
                </div>
            );
        }
    };
