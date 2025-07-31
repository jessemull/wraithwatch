'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Entity } from '../types';

interface ThreeJSVisualizationProps {
  entities: Entity[];
  isConnected: boolean;
}

export const ThreeJSVisualization: React.FC<ThreeJSVisualizationProps> = ({
  entities,
  isConnected,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const nodesRef = useRef<THREE.Group | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create nodes group
    const nodesGroup = new THREE.Group();
    nodesRef.current = nodesGroup;
    scene.add(nodesGroup);

    // Create entity nodes
    entities.forEach((entity, index) => {
      const geometry = new THREE.SphereGeometry(0.3, 16, 16);
      const material = new THREE.MeshPhongMaterial({
        color: getEntityColor(entity),
        transparent: true,
        opacity: 0.8,
      });

      const node = new THREE.Mesh(geometry, material);

      // Position nodes in a circle
      const angle = (index / entities.length) * Math.PI * 2;
      const radius = 5;
      node.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.5,
        0
      );

      // Add glow effect for AI agents
      if (entity.type === 'AI_Agent') {
        const glowGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: 0x3b82f6,
          transparent: true,
          opacity: 0.3,
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        node.add(glow);
      }

      // Add threat score indicator
      if (entity.threatScore && entity.threatScore > 0.5) {
        const threatGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const threatMaterial = new THREE.MeshBasicMaterial({
          color: 0xff4444,
          transparent: true,
          opacity: 0.8,
        });
        const threatIndicator = new THREE.Mesh(threatGeometry, threatMaterial);
        threatIndicator.position.set(0.4, 0.4, 0);
        node.add(threatIndicator);
      }

      nodesGroup.add(node);
    });

    // Add connections between network nodes
    const networkNodes = entities.filter(e => e.type === 'Network_Node');
    networkNodes.forEach((node1, i) => {
      networkNodes.slice(i + 1).forEach(() => {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(1, 0, 0),
        ]);
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0x3b82f6,
          transparent: true,
          opacity: 0.3,
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        nodesGroup.add(line);
      });
    });

    mountRef.current.appendChild(renderer.domElement);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      // Rotate nodes group
      if (nodesGroup) {
        nodesGroup.rotation.y += 0.005;
      }

      // Animate individual nodes
      nodesGroup.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          child.rotation.y += 0.01;
          child.position.y += Math.sin(Date.now() * 0.001 + index) * 0.001;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;

      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      const mountElement = mountRef.current;
      if (mountElement && renderer.domElement) {
        mountElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [entities]);

  const getEntityColor = (entity: Entity): number => {
    switch (entity.type) {
      case 'AI_Agent':
        return 0x3b82f6; // Blue
      case 'Network_Node':
        return 0x10b981; // Green
      case 'Threat':
        return 0xef4444; // Red
      case 'System':
        return 0xf59e0b; // Yellow
      case 'User':
        return 0x8b5cf6; // Purple
      case 'Sensor':
        return 0x06b6d4; // Cyan
      default:
        return 0x6b7280; // Gray
    }
  };

  return (
    <div className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
      {!isConnected && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-xs">
          Disconnected
        </div>
      )}
    </div>
  );
};
