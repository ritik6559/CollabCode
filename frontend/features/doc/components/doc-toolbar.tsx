"use client";

import React from "react";
import { Editor, useEditorState } from "@tiptap/react";
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Redo2,
    Strikethrough,
    Underline,
    Undo2,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface DocToolbarProps {
    editor: Editor;
}

const FONT_SIZES = ["12px", "14px", "16px", "18px", "24px", "32px", "48px"];

const PARAGRAPH_STYLES = [
    { value: "p", label: "Normal text" },
    { value: "h1", label: "Title" },
    { value: "h2", label: "Subtitle" },
    { value: "h3", label: "Heading" },
];

const ToolbarButton = ({
    onClick,
    active,
    disabled,
    label,
    children,
}: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    label: string;
    children: React.ReactNode;
}) => (
    <button
        type="button"
        aria-label={label}
        title={label}
        disabled={disabled}
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
        className={`grid h-8 w-8 place-items-center rounded-lg transition-colors disabled:opacity-40 ${
            active
                ? "bg-amber-400/20 text-amber-300"
                : "text-stone-300 hover:bg-stone-800/80 hover:text-stone-50"
        }`}
    >
        {children}
    </button>
);

const Divider = () => <span className="mx-1 h-5 w-px bg-stone-100/10" />;

const DocToolbar = ({ editor }: DocToolbarProps) => {
    const state = useEditorState({
        editor,
        selector: (ctx) => ({
            bold: ctx.editor.isActive("bold"),
            italic: ctx.editor.isActive("italic"),
            underline: ctx.editor.isActive("underline"),
            strike: ctx.editor.isActive("strike"),
            bulletList: ctx.editor.isActive("bulletList"),
            orderedList: ctx.editor.isActive("orderedList"),
            blockquote: ctx.editor.isActive("blockquote"),
            alignLeft: ctx.editor.isActive({ textAlign: "left" }),
            alignCenter: ctx.editor.isActive({ textAlign: "center" }),
            alignRight: ctx.editor.isActive({ textAlign: "right" }),
            canUndo: ctx.editor.can().undo(),
            canRedo: ctx.editor.can().redo(),
            fontSize: ctx.editor.getAttributes("textStyle").fontSize as string | undefined,
            paragraphStyle: ctx.editor.isActive("heading", { level: 1 })
                ? "h1"
                : ctx.editor.isActive("heading", { level: 2 })
                ? "h2"
                : ctx.editor.isActive("heading", { level: 3 })
                ? "h3"
                : "p",
        }),
    });

    const setParagraphStyle = (value: string) => {
        const chain = editor.chain().focus();
        if (value === "p") {
            chain.setParagraph().run();
        } else {
            chain.setHeading({ level: Number(value.slice(1)) as 1 | 2 | 3 }).run();
        }
    };

    return (
        <div className="sticky top-16 z-30 border-b border-stone-100/10 bg-stone-950/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-1 px-4 py-2">
                <ToolbarButton
                    label="Undo"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!state.canUndo}
                >
                    <Undo2 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Redo"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!state.canRedo}
                >
                    <Redo2 className="h-4 w-4" />
                </ToolbarButton>

                <Divider />

                <Select value={state.paragraphStyle} onValueChange={setParagraphStyle}>
                    <SelectTrigger
                        size="sm"
                        className="h-8 w-[130px] border-stone-100/10 bg-transparent text-xs text-stone-200 focus-visible:ring-amber-400/20"
                    >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-stone-100/10 bg-stone-900/95 backdrop-blur-xl">
                        {PARAGRAPH_STYLES.map((style) => (
                            <SelectItem
                                key={style.value}
                                value={style.value}
                                className="cursor-pointer text-xs text-stone-200 focus:bg-stone-800/80 focus:text-stone-50"
                            >
                                {style.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={state.fontSize ?? "16px"}
                    onValueChange={(size) => editor.chain().focus().setFontSize(size).run()}
                >
                    <SelectTrigger
                        size="sm"
                        className="h-8 w-[80px] border-stone-100/10 bg-transparent text-xs text-stone-200 focus-visible:ring-amber-400/20"
                    >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-stone-100/10 bg-stone-900/95 backdrop-blur-xl">
                        {FONT_SIZES.map((size) => (
                            <SelectItem
                                key={size}
                                value={size}
                                className="cursor-pointer text-xs text-stone-200 focus:bg-stone-800/80 focus:text-stone-50"
                            >
                                {size.replace("px", "")}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Divider />

                <ToolbarButton
                    label="Bold"
                    active={state.bold}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Italic"
                    active={state.italic}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Underline"
                    active={state.underline}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                    <Underline className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Strikethrough"
                    active={state.strike}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                    <Strikethrough className="h-4 w-4" />
                </ToolbarButton>

                <Divider />

                <ToolbarButton
                    label="Align left"
                    active={state.alignLeft}
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                >
                    <AlignLeft className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Align center"
                    active={state.alignCenter}
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                >
                    <AlignCenter className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Align right"
                    active={state.alignRight}
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                >
                    <AlignRight className="h-4 w-4" />
                </ToolbarButton>

                <Divider />

                <ToolbarButton
                    label="Bullet list"
                    active={state.bulletList}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Numbered list"
                    active={state.orderedList}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Quote"
                    active={state.blockquote}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <Quote className="h-4 w-4" />
                </ToolbarButton>
            </div>
        </div>
    );
};

export default DocToolbar;
