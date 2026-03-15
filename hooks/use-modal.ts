"use client";
import { useState } from "react";

export interface ModalOptions<T = unknown> {
    isEdit?: boolean;
    data?: T | null;
    onClose?: () => void;
}

export interface Modal<T = unknown> {
    isOpen: boolean;
    isEdit: boolean;
    data: T | null;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    open: (opts?: ModalOptions<T>) => void;
    setIsOpen: (open: boolean) => void;
    close: () => void;
    updateData: (data: T | null) => void;
}

export function useModal<T = unknown>(): Modal<T> {
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<T | null>(null);

    const open = ({
        isEdit = false,
        data = null,
    }: ModalOptions<T> = {}) => {
        setIsLoading(false);
        setIsEdit(isEdit);
        setData(data);
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
        setIsEdit(false);
        setData(null);
        setIsLoading(false);
    };

    const updateData = (data: T | null) => {
        setData(data);
    };

    return {
        isOpen,
        isEdit,
        data,
        isLoading,
        setIsLoading,
        open,
        close,
        updateData,
        setIsOpen
    };
}