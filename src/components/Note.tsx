'use client'

import { Note as NoteModel } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
import AddEditNoteDialog from "./AddEditNoteDIalog";
import { Button } from "./ui/button";

interface NoteProps {
    note: NoteModel,
}

export default function Note({note}: NoteProps) {

    const [ showEditNote, setShowEditNote ] = useState<boolean>(false)
    const wasUpdated = note.updatedAt > note.createdAt;
    
    const createdOrUpdatedAtTimestamp: string = (
        wasUpdated ? note.updatedAt : note.createdAt
    ).toDateString();

    return (
        <>
            <Card
                onClick={() => setShowEditNote(!showEditNote)}
                className="cursor-pointer transition-shadow hover:shadow-lg"
            >
                <CardHeader>
                    <CardTitle
                        className="text-wrap max-w-64 break-words"
                    >
                        {note.title}
                    </CardTitle>
                    <CardDescription>
                        {createdOrUpdatedAtTimestamp}
                        {wasUpdated && " (updated)"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-line">
                        {note.content}
                    </p>
                </CardContent>
            </Card>
            <AddEditNoteDialog 
                open={showEditNote}
                setOpen={setShowEditNote}
                note_to_edit={note}
            />
        </>
        
    )
}