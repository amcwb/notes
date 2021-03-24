declare class MediumEditor {
    constructor (selector: string, options: { [key: string]: any });
    subscribe(event: string, cb: (event: Event, editable: any) => void): void;
    destroy(): void;
    execAction(action: any): void;
}

declare class MediumEditorTable {}
// declare namespace bootbox {
//     prompt (message: string, cb: (result: string) => any): void;
//     confirm (message: string, cb: (result: boolean) => any): void;
// };

declare let bootbox: any;